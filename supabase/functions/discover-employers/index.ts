// Nightly agent: finds Bristol-area companies that are advertising jobs in public
// and adds them to the list the existing scraper and prospect agent already read.
// It never emails anyone and never touches personal data — companies only.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

const JOB_NAME = "discover-employers";
const BATCH_LIMIT = 20; // hard cap on new companies added per run
const LOCK_MINUTES = 20;
const SEARCH_LIMIT = 10; // results per query

const QUERIES = [
  "Bristol jobs careers site",
  "Bristol software developer jobs company careers page",
  "Bristol marketing jobs company careers page",
  "Bristol finance jobs company careers page",
  "Bristol engineering jobs company careers page",
  "Bristol operations jobs company careers page",
];

// Middlemen we do not want to invite, and places that are not a single employer.
const EXCLUDED_KEYWORDS = [
  "recruit", "recruitment", "talent", "staffing", "resourcing", "headhunt",
  "indeed", "totaljobs", "reed", "hays", "michaelpage", "adecco", "randstad",
  "glassdoor", "linkedin", "monster", "cv-library", "cvlibrary", "jobsite",
  "ziprecruiter", "workable", "greenhouse", "lever", "bamboohr", "jobserve",
  "guardianjobs", "jobs", "careerjet", "adzuna", "gov.uk", "wikipedia",
  "facebook", "twitter", "youtube", "reddit",
];

const NEAR_BRISTOL = [
  "bristol", "bs1", "bs2", "bs3", "bs4", "bs5", "bs6", "bs7", "bs8", "bs9",
  "bs10", "bs11", "bs13", "bs14", "bs15", "bs16", "bs20", "bs30", "bs31",
  "bs32", "bs34", "bs35", "bs37", "bs48", "bath", "portishead", "clevedon",
  "thornbury", "yate", "keynsham", "nailsea", "weston-super-mare", "filton",
  "avonmouth", "aztec west",
];

const CAREERS_PATHS = ["/careers", "/jobs", "/careers/", "/join-us", "/work-with-us", "/about/careers", "/company/careers"];

function normalise(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function apexDomain(url: string | null): string | null {
  if (!url) return null;
  try {
    const host = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
    return host.toLowerCase();
  } catch {
    return null;
  }
}

function looksLikeMiddleman(name: string, domain: string | null) {
  const haystack = `${name} ${domain ?? ""}`.toLowerCase();
  return EXCLUDED_KEYWORDS.some((k) => haystack.includes(k));
}

function mentionsBristol(text: string) {
  const lower = text.toLowerCase();
  return NEAR_BRISTOL.some((place) => lower.includes(place));
}

/** Tidies "Careers at Acme Ltd | Jobs" into "Acme Ltd". */
function companyNameFrom(title: string, domain: string | null) {
  const cleaned = title
    .split(/[|\u2013\u2014\u00b7:]/)[0]
    .replace(/\b(careers?|jobs?|vacancies|work with us|join us|hiring|home)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length >= 2 && cleaned.length <= 80) return cleaned;
  if (!domain) return null;
  const base = domain.split(".")[0];
  return base.charAt(0).toUpperCase() + base.slice(1);
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

/** Finds the company's own careers page by trying the usual addresses. */
async function findCareersPage(website: string): Promise<string | null> {
  let base: URL;
  try {
    base = new URL(website.startsWith("http") ? website : `https://${website}`);
  } catch {
    return null;
  }

  for (const path of CAREERS_PATHS) {
    const target = new URL(path, base).toString();
    const html = await fetchPage(target);
    if (html && /vacanc|job|role|position|careers/i.test(html)) return target;
  }

  // Fall back to a careers link on the home page.
  const home = await fetchPage(base.toString());
  if (home) {
    const match = home.match(/href=["']([^"']*(careers|jobs|join-us|work-with-us)[^"']*)["']/i);
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

interface SearchHit {
  url: string;
  title: string;
  description?: string;
}

async function firecrawlSearch(query: string): Promise<SearchHit[]> {
  const response = await fetch(`${FIRECRAWL_V2}/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, limit: SEARCH_LIMIT, country: "gb", lang: "en", tbs: "qdr:w" }),
  });

  if (!response.ok) {
    const body = await response.text();
    const err = new Error(`Firecrawl search failed [${response.status}]: ${body.slice(0, 300)}`);
    (err as any).status = response.status;
    throw err;
  }

  const payload = await response.json();
  const rows = payload?.data?.web ?? payload?.data ?? [];
  return (Array.isArray(rows) ? rows : []).map((r: any) => ({
    url: r.url,
    title: r.title ?? "",
    description: r.description ?? "",
  })).filter((r: SearchHit) => !!r.url);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  // Optional: a single website an admin pasted in, which skips the search step.
  let manualWebsite: string | null = null;
  try {
    const body = await req.json();
    if (body?.website && typeof body.website === "string") manualWebsite = body.website.trim().slice(0, 300);
  } catch {
    /* no body: scheduled run */
  }

  try {
    if (!FIRECRAWL_API_KEY && !manualWebsite) {
      throw new Error("FIRECRAWL_API_KEY is not configured");
    }

    // Adding a company by hand is an admin-only action.
    if (manualWebsite) {
      const token = req.headers.get("Authorization")?.replace("Bearer ", "");
      if (!token) return new Response(JSON.stringify({ error: "Not signed in" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const { data: userData } = await supabase.auth.getUser(token);
      const email = userData?.user?.email;
      if (!email) return new Response(JSON.stringify({ error: "Not signed in" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const { data: admin } = await supabase.from("admins").select("id").eq("email", email).maybeSingle();
      if (!admin) return new Response(JSON.stringify({ error: "Admins only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const now = new Date();

    // --- Paused, or already running? --------------------------------------
    const { data: lock } = await supabase
      .from("job_locks")
      .select("*")
      .eq("job_name", JOB_NAME)
      .maybeSingle();

    if (!manualWebsite) {
      if (lock?.paused_reason) {
        return new Response(JSON.stringify({ skipped: true, reason: lock.paused_reason }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (lock && new Date(lock.locked_until) > now) {
        return new Response(JSON.stringify({ skipped: true, reason: "already running" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error: lockError } = await supabase.from("job_locks").upsert(
        {
          job_name: JOB_NAME,
          locked_until: new Date(now.getTime() + LOCK_MINUTES * 60_000).toISOString(),
          last_run_at: now.toISOString(),
          updated_at: now.toISOString(),
        },
        { onConflict: "job_name" },
      );
      if (lockError) throw lockError;
    }

    // --- Who do we already know about? ------------------------------------
    const [{ data: companies }, { data: employers }, { data: prospects }] = await Promise.all([
      supabase.from("target_companies").select("company_name, website, excluded_reason"),
      supabase.from("employer_profiles").select("company_name"),
      supabase.from("employer_prospects").select("company_name, skip_reason"),
    ]);

    const knownNames = new Set<string>();
    const knownDomains = new Set<string>();
    for (const c of companies || []) {
      knownNames.add(normalise((c as any).company_name || ""));
      const d = apexDomain((c as any).website);
      if (d) knownDomains.add(d);
    }
    for (const e of employers || []) knownNames.add(normalise((e as any).company_name || ""));
    for (const p of prospects || []) knownNames.add(normalise((p as any).company_name || ""));

    // --- Gather candidate pages -------------------------------------------
    const hits: SearchHit[] = [];

    if (manualWebsite) {
      hits.push({ url: manualWebsite, title: "" });
    } else {
      for (const query of QUERIES) {
        if (hits.length >= BATCH_LIMIT * 4) break;
        try {
          hits.push(...(await firecrawlSearch(query)));
        } catch (error: any) {
          const status = error.status;
          // Circuit breaker: stop the whole run on credit, policy or rate limits.
          if (status === 402 || status === 403 || status === 429) {
            await supabase.from("job_locks").upsert(
              {
                job_name: JOB_NAME,
                locked_until: new Date().toISOString(),
                paused_reason: `Search paused: ${error.message}`.slice(0, 300),
                updated_at: new Date().toISOString(),
              },
              { onConflict: "job_name" },
            );
            return new Response(JSON.stringify({ paused: true, reason: error.message }), {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          console.error(error.message);
        }
      }
    }

    // --- Turn pages into companies ----------------------------------------
    const added: string[] = [];
    const handledDomains = new Set<string>();

    for (const hit of hits) {
      if (added.length >= BATCH_LIMIT) break;

      const domain = apexDomain(hit.url);
      if (!domain || handledDomains.has(domain) || knownDomains.has(domain)) continue;
      handledDomains.add(domain);

      const name = companyNameFrom(hit.title || domain, domain);
      if (!name) continue;

      const key = normalise(name);
      if (knownNames.has(key)) continue;
      if (looksLikeMiddleman(name, domain)) continue;

      const website = `https://${domain}`;
      const careers = await findCareersPage(website);
      if (!careers) continue;

      // Only companies within reach of Bristol.
      if (!manualWebsite) {
        const careersHtml = await fetchPage(careers);
        const context = `${hit.title} ${hit.description ?? ""} ${careersHtml ?? ""}`;
        if (!mentionsBristol(context)) continue;
      }

      const { error: insertError } = await supabase.from("target_companies").insert({
        company_name: name,
        website,
        careers_page_url: careers,
        location: "Bristol",
        is_active: true,
        discovered_from: manualWebsite ? "added by admin" : hit.url,
        notes: manualWebsite ? "Added by hand from the admin page" : `Found via public job search: ${hit.url}`,
      });

      if (insertError) {
        if (!insertError.message.includes("duplicate")) console.error("Could not add company:", insertError.message);
        continue;
      }

      knownNames.add(key);
      knownDomains.add(domain);
      added.push(name);
    }

    if (!manualWebsite) {
      await supabase
        .from("job_locks")
        .update({ locked_until: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("job_name", JOB_NAME);
    }

    return new Response(JSON.stringify({ added: added.length, companies: added }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("discover-employers failed:", error);
    if (!manualWebsite) {
      await supabase.from("job_locks").upsert(
        {
          job_name: JOB_NAME,
          locked_until: new Date().toISOString(),
          paused_reason: `Failed: ${error.message}`.slice(0, 300),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "job_name" },
      );
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
