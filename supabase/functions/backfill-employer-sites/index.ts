// Gives companies we found through a job feed their own website and careers
// page, so the nightly reader can visit them directly instead of only ever
// seeing the one advert that introduced them.
// Companies only — no personal data, nothing emailed.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

const JOB_NAME = "backfill-employer-sites";
const BATCH = 20; // companies looked at per run
const SEARCH_BUDGET = 6; // paid searches per run, only for ones we can't guess
const MAX_HOPS = 10;
const LOCK_MINUTES = 15;

const CAREERS_PATHS = [
  "/careers",
  "/jobs",
  "/careers/",
  "/join-us",
  "/work-with-us",
  "/about/careers",
  "/company/careers",
  "/vacancies",
];

const EXCLUDED_DOMAIN_PARTS = [
  "job", "vacanc", "hiring", "recruit", "talent", "staffing", "resourcing",
  "headhunt", "employment", "indeed", "totaljobs", "reed.co", "adzuna",
  "cv-library", "cvlibrary", "glassdoor", "linkedin", "monster", "jooble",
  "ziprecruiter", "workable", "greenhouse", "lever.co", "bamboohr", "workday",
  "smartrecruiters", "facebook", "twitter", "x.com", "youtube", "wikipedia",
  "gov.uk", "companieshouse",
];

function slug(name: string) {
  return name
    .toLowerCase()
    .replace(/\b(ltd|limited|llp|plc|uk|group|holdings|the)\b/g, " ")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function apexDomain(url: string | null): string | null {
  if (!url) return null;
  try {
    let host = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.toLowerCase();
    host = host.replace(/^(www|careers?|jobs?|apply|hire|hiring|talent|work)\./, "");
    return host;
  } catch {
    return null;
  }
}

function looksLikeMiddleman(domain: string | null) {
  if (!domain) return true;
  return EXCLUDED_DOMAIN_PARTS.some((k) => domain.includes(k));
}

async function fetchPage(url: string, timeoutMs = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "JobzBot/1.0 (+https://jobz.dgrid.co)" },
    });
    if (!response.ok) return null;
    return (await response.text()).slice(0, 200_000);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Does this page really belong to the company we're looking for? */
function pageBelongsTo(html: string, companySlug: string) {
  const title = (html.match(/<title[^>]*>([\s\S]{0,200})<\/title>/i)?.[1] ?? "").toLowerCase();
  const stem = companySlug.slice(0, Math.min(companySlug.length, 8));
  if (stem.length < 4) return false;
  return slug(title).includes(stem);
}

/** The cheap way: try the obvious addresses for the company's name. */
async function guessWebsite(name: string): Promise<string | null> {
  const s = slug(name);
  if (s.length < 4) return null;
  for (const suffix of [".co.uk", ".com", ".org.uk", ".org", ".uk"]) {
    const candidate = `https://${s}${suffix}`;
    const html = await fetchPage(candidate, 5000);
    if (html && pageBelongsTo(html, s)) return candidate;
  }
  return null;
}

let lastCallAt = 0;
async function throttle(gapMs = 7000) {
  const wait = lastCallAt + gapMs - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCallAt = Date.now();
}

/** The paid way, used sparingly: ask the search service for their site. */
async function searchWebsite(name: string): Promise<string | null> {
  if (!FIRECRAWL_API_KEY) return null;
  await throttle();
  const response = await fetch(`${FIRECRAWL_V2}/search`, {
    method: "POST",
    headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `"${name}" Bristol official website`,
      limit: 6,
      country: "gb",
      lang: "en",
    }),
  });

  if (!response.ok) {
    const err = new Error(`Firecrawl search failed [${response.status}]`);
    (err as any).status = response.status;
    throw err;
  }

  const payload = await response.json();
  const rows = payload?.data?.web ?? payload?.data ?? [];
  const s = slug(name);
  for (const row of Array.isArray(rows) ? rows : []) {
    const domain = apexDomain(row?.url);
    if (!domain || looksLikeMiddleman(domain)) continue;
    const stem = domain.split(".")[0].replace(/[^a-z0-9]/g, "");
    if (stem.length >= 4 && s.includes(stem.slice(0, 4))) return `https://${domain}`;
  }
  return null;
}

async function findCareersPage(website: string): Promise<string | null> {
  let base: URL;
  try {
    base = new URL(website);
  } catch {
    return null;
  }

  for (const path of CAREERS_PATHS) {
    const target = new URL(path, base).toString();
    const html = await fetchPage(target, 5000);
    if (html && /vacanc|job|role|position|careers/i.test(html)) return target;
  }

  const home = await fetchPage(base.toString(), 5000);
  if (home) {
    const match = home.match(/href=["']([^"']*(careers|jobs|join-us|work-with-us|vacancies)[^"']*)["']/i);
    if (match) {
      try {
        return new URL(match[1], base).toString();
      } catch {
        /* ignore */
      }
    }
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  let hop = 0;
  try {
    const body = await req.json().catch(() => ({}));
    hop = Number(body?.hop ?? 0);
  } catch {
    /* ignore */
  }

  // Single flight: one run at a time.
  const now = new Date();
  const { data: lock } = await supabase
    .from("job_locks")
    .select("locked_until, paused_reason")
    .eq("job_name", JOB_NAME)
    .maybeSingle();

  if (lock?.paused_reason) {
    return new Response(JSON.stringify({ paused: lock.paused_reason }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (hop === 0 && lock?.locked_until && new Date(lock.locked_until) > now) {
    return new Response(JSON.stringify({ skipped: "already running" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  await supabase.from("job_locks").upsert(
    {
      job_name: JOB_NAME,
      locked_until: new Date(now.getTime() + LOCK_MINUTES * 60_000).toISOString(),
      last_run_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    { onConflict: "job_name" },
  );

  let fixed = 0;
  let missed = 0;
  let searches = 0;
  let paused: string | null = null;

  try {
    const { data: companies } = await supabase
      .from("target_companies")
      .select("id, company_name")
      .is("website", null)
      .is("excluded_reason", null)
      .is("site_lookup_at", null)
      .limit(BATCH);

    for (const company of companies ?? []) {
      let website = await guessWebsite(company.company_name);

      if (!website && searches < SEARCH_BUDGET) {
        searches += 1;
        try {
          website = await searchWebsite(company.company_name);
        } catch (error: any) {
          if ([401, 402, 403, 429].includes(error?.status)) {
            paused = `Search service said ${error.status}`;
            break;
          }
        }
      }

      const domain = apexDomain(website);
      if (!website || looksLikeMiddleman(domain)) {
        missed += 1;
        await supabase
          .from("target_companies")
          .update({ site_lookup_at: new Date().toISOString() })
          .eq("id", company.id);
        continue;
      }

      const careers = await findCareersPage(website);
      await supabase
        .from("target_companies")
        .update({
          website,
          careers_page_url: careers ?? website,
          is_active: !!careers,
          site_lookup_at: new Date().toISOString(),
          notes: careers ? "Website and careers page found automatically" : "Website found, no careers page yet",
        })
        .eq("id", company.id);

      if (careers) fixed += 1;
      else missed += 1;
    }

    // Anything left to do? Carry on in a fresh run rather than time out.
    let continuing = false;
    if (!paused && hop < MAX_HOPS && (companies?.length ?? 0) === BATCH) {
      continuing = true;
      EdgeRuntime.waitUntil(
        (async () => {
          await new Promise((r) => setTimeout(r, 3000));
          await fetch(`${SUPABASE_URL}/functions/v1/${JOB_NAME}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${SERVICE_ROLE}`, "Content-Type": "application/json" },
            body: JSON.stringify({ hop: hop + 1 }),
          });
        })(),
      );
    }

    await supabase
      .from("job_locks")
      .update({
        locked_until: continuing ? new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString() : new Date().toISOString(),
        paused_reason: paused,
        updated_at: new Date().toISOString(),
      })
      .eq("job_name", JOB_NAME);

    return new Response(JSON.stringify({ hop, looked: companies?.length ?? 0, fixed, missed, continuing, paused }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("backfill-employer-sites failed:", error);
    await supabase
      .from("job_locks")
      .update({ locked_until: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("job_name", JOB_NAME);
    return new Response(JSON.stringify({ error: error?.message ?? "failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
