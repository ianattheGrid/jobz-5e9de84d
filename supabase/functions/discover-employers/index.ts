// Nightly agent: finds Bristol-area companies that are advertising jobs in public
// and adds them to the list the existing scraper and prospect agent already read.
// It never emails anyone and never touches personal data — companies only.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

const JOB_NAME = "discover-employers";
const BATCH_LIMIT = 20; // hard cap on new companies added per run
const LOCK_MINUTES = 20;
const SEARCH_LIMIT = 10; // results per query

// Keep the big job boards out of the results so we land on companies' own pages.
const NOT_BOARDS =
  "-site:indeed.com -site:reed.co.uk -site:totaljobs.com -site:linkedin.com " +
  "-site:glassdoor.co.uk -site:cv-library.co.uk -site:adzuna.co.uk -site:jobsite.co.uk " +
  "-site:bebee.com -site:jooble.org -site:theguardian.com -site:charityjob.co.uk";

const QUERIES = [
  `"careers" "Bristol" company vacancies ${NOT_BOARDS}`,
  `"we are hiring" Bristol company careers page ${NOT_BOARDS}`,
  `Bristol software developer "join our team" careers ${NOT_BOARDS}`,
  `Bristol marketing agency careers "current vacancies" ${NOT_BOARDS}`,
  `Bristol finance accountancy firm careers "current vacancies" ${NOT_BOARDS}`,
  `Bristol engineering manufacturing company careers vacancies ${NOT_BOARDS}`,
];

// Middlemen we do not want to invite, and places that are not a single employer.
// Matched against the web address, which is where boards and agencies give
// themselves away ("...jobs.co.uk", "...recruitment.com").
const EXCLUDED_DOMAIN_PARTS = [
  "job", "vacanc", "career", "hiring", "recruit", "talent", "staffing",
  "resourcing", "headhunt", "employment", "graduate", "placement", "apprentice",
  "indeed", "totaljobs", "reed.co", "hays", "michaelpage", "adecco", "randstad",
  "manpower", "experis", "pertemps", "brookstreet", "sthree", "robertwalters",
  "glassdoor", "linkedin", "monster", "cv-library", "cvlibrary", "ziprecruiter",
  "workable", "greenhouse", "lever.co", "bamboohr", "workday", "smartrecruiters",
  "adzuna", "careerjet", "jooble", "bebee", "neuvoo", "trovit", "jobrapido",
  "gov.uk", "nhs.uk", "ac.uk", "wikipedia", "facebook", "twitter", "x.com",
  "youtube", "reddit", "medium.com", "eventbrite", "glassdoor",
];

// Words that mean the page title is an advert, not a company.
const ADVERT_WORDS = /\b(salary|per annum|£|apply now|full[- ]time|part[- ]time|vacanc|hiring now|\d{2,}\+)\b/i;

const NEAR_BRISTOL = [
  "bristol", "bs1", "bs2", "bs3", "bs4", "bs5", "bs6", "bs7", "bs8", "bs9",
  "bs10", "bs11", "bs13", "bs14", "bs15", "bs16", "bs20", "bs30", "bs31",
  "bs32", "bs34", "bs35", "bs37", "bs48", "bath", "portishead", "clevedon",
  "thornbury", "yate", "keynsham", "nailsea", "weston-super-mare", "filton",
  "avonmouth", "aztec west",
];

const CAREERS_PATHS = ["/careers", "/jobs", "/careers/", "/join-us", "/work-with-us", "/about/careers", "/company/careers"];

// --- Reading the job boards -------------------------------------------------
// Most Bristol vacancies appear on the boards. We read them, work out who is
// really hiring, and keep only the companies who employ people themselves.
const BOARD_SITES = [
  "site:uk.indeed.com",
  "site:reed.co.uk",
  "site:totaljobs.com",
  "site:cv-library.co.uk",
  "site:adzuna.co.uk",
];

const BOARD_AREAS = ["", "software developer", "marketing", "finance", "engineering", "customer service"];

// Names that give an agency away.
const AGENCY_NAME_WORDS = [
  "recruit", "recruitment", "resourcing", "staffing", "talent", "search", "selection",
  "personnel", "manpower", "headhunt", "consultancy", "consultants", "appointments",
  "employment agency", "solutions ltd", "people group", "hays", "reed", "adecco",
  "randstad", "pertemps", "brook street", "michael page", "robert walters", "sthree",
  "gi group", "office angels", "blue arrow", "search consultancy", "rise technical",
];

// Phrases only an agency writes.
const AGENCY_PHRASES = [
  "our client", "my client", "on behalf of", "client is looking", "we are recruiting for",
  "confidential client", "a leading bristol", "acting as an employment agency",
  "acting as an employment business", "recruitment consultant will", "rec2rec",
  "we are working with", "our customer", "send us your cv", "one of our clients",
];

function normalise(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** The company's own address, with hosting subdomains like careers. stripped off. */
function apexDomain(url: string | null): string | null {
  if (!url) return null;
  try {
    let host = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.toLowerCase();
    host = host.replace(/^(www|careers?|jobs?|apply|boards|hire|hiring|recruiting|talent|work)\./, "");
    return host;
  } catch {
    return null;
  }
}

function looksLikeMiddleman(domain: string | null) {
  if (!domain) return true;
  return EXCLUDED_DOMAIN_PARTS.some((k) => domain.includes(k));
}

function mentionsBristol(text: string) {
  const lower = text.toLowerCase();
  return NEAR_BRISTOL.some((place) => lower.includes(place));
}

function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((w) => (w.length > 3 ? w.charAt(0).toUpperCase() + w.slice(1) : w.toUpperCase() === w ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

/**
 * Prefers the readable company name from the page heading ("Careers - Bristol
 * Water" gives "Bristol Water") and falls back to the web address.
 */
function companyNameFrom(domain: string, title?: string) {
  const pieces = (title ?? "")
    .split(/[|\u2013\u2014\u00b7\-:]/)
    .map((p) =>
      p
        .replace(/\b(careers?|jobs?|vacancies|current vacancies|work (for|with) us|join (our team|us)|hiring|home|life at)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((p) => p.length >= 3 && p.length <= 40 && /[a-z]/i.test(p) && !ADVERT_WORDS.test(p));

  const fromTitle = pieces.sort((a, b) => b.length - a.length)[0];
  if (fromTitle) return titleCase(fromTitle);

  const base = domain.split(".")[0].replace(/[-_]+/g, " ").trim();
  if (base.length < 2 || base.length > 40) return null;
  return titleCase(base);
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

// The search service allows ten requests a minute, so we queue ours politely.
let lastCallAt = 0;
async function throttle(gapMs = 7000) {
  const wait = lastCallAt + gapMs - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCallAt = Date.now();
}

async function firecrawlSearch(query: string): Promise<SearchHit[]> {
  await throttle();
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

/** Reads a single board listing so we can see who wrote the advert. */
async function firecrawlScrape(url: string): Promise<string | null> {
  try {
    await throttle();
    const response = await fetch(`${FIRECRAWL_V2}/scrape`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
    });

    if (!response.ok) {
      const body = await response.text();
      const err = new Error(`Firecrawl scrape failed [${response.status}]: ${body.slice(0, 200)}`);
      (err as any).status = response.status;
      throw err;
    }

    const payload = await response.json();
    const markdown = payload?.markdown ?? payload?.data?.markdown ?? null;
    return typeof markdown === "string" ? markdown.slice(0, 40_000) : null;
  } catch (error: any) {
    if ([402, 403, 429].includes(error?.status)) throw error;
    console.error(error?.message ?? String(error));
    return null;
  }
}

/** The name of whoever placed the advert, as the board prints it. */
function advertiserFrom(markdown: string, title: string): string | null {
  const patterns = [
    /(?:posted by|advertised by|recruiter|employer|company)\s*[:\-–]\s*([A-Za-z0-9&'.,\- ]{2,60})/i,
    /\n\s*##?#?\s*([A-Za-z0-9&'.,\- ]{2,60})\s*\n[\s\S]{0,200}?(?:bristol)/i,
  ];
  for (const pattern of patterns) {
    const match = markdown.match(pattern);
    const value = match?.[1]?.trim();
    if (value && value.length >= 2 && !ADVERT_WORDS.test(value)) return value.replace(/\s+/g, " ");
  }

  // Boards often print "Job title - Company - Location" in the page title.
  const parts = title.split(/[|\u2013\u2014\-]/).map((p) => p.trim()).filter(Boolean);
  const candidate = parts.find(
    (p) => p.length >= 3 && p.length <= 60 && !ADVERT_WORDS.test(p) && !/bristol|jobs?$/i.test(p),
  );
  return candidate ?? null;
}

function looksLikeAgencyName(name: string) {
  const lower = name.toLowerCase();
  return AGENCY_NAME_WORDS.some((w) => lower.includes(w));
}

function advertWrittenByAgency(markdown: string) {
  const lower = markdown.toLowerCase();
  return AGENCY_PHRASES.some((p) => lower.includes(p));
}

/** Finds the advertiser's own website so we can look at what they actually do. */
async function resolveWebsite(name: string): Promise<string | null> {
  try {
    const hits = await firecrawlSearch(`"${name}" Bristol official website ${NOT_BOARDS}`);
    for (const hit of hits) {
      const domain = apexDomain(hit.url);
      if (!domain || looksLikeMiddleman(domain)) continue;
      const stem = normalise(name).slice(0, 8);
      if (stem.length >= 4 && !normalise(domain).includes(stem.slice(0, 4))) continue;
      return domain;
    }
  } catch (error: any) {
    if ([402, 403, 429].includes(error?.status)) throw error;
    console.error(error?.message ?? String(error));
  }
  return null;
}

/**
 * Second pass over the shortlist: keeps companies that employ people directly
 * and drops job boards, recruitment agencies and directories. If this check is
 * unavailable we keep nothing rather than filling the list with rubbish.
 */
async function keepRealEmployers(hits: SearchHit[]): Promise<Set<string>> {
  const kept = new Set<string>();
  if (!hits.length || !LOVABLE_API_KEY) return kept;

  const listing = hits
    .map((h, i) => `${i + 1}. ${apexDomain(h.url)} — ${(h.title || "").slice(0, 120)}`)
    .join("\n");

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        reasoning_effort: "low",
        messages: [
          {
            role: "system",
            content:
              "You sort web addresses into two piles. KEEP an address only if it belongs to a single organisation that employs people directly (a business, charity, school or public body). DROP job boards, job aggregators, recruitment or staffing agencies, careers advice sites, directories, news sites and social networks. Reply with only the numbers to keep, comma separated. If none, reply NONE.",
          },
          { role: "user", content: listing },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      const err = new Error(`Employer check failed [${response.status}]: ${body.slice(0, 200)}`);
      (err as any).status = response.status;
      throw err;
    }

    const payload = await response.json();
    const answer: string = payload?.choices?.[0]?.message?.content ?? "";
    for (const match of answer.matchAll(/\d+/g)) {
      const hit = hits[Number(match[0]) - 1];
      const domain = hit ? apexDomain(hit.url) : null;
      if (domain) kept.add(domain);
    }
  } catch (error: any) {
    console.error(error.message);
    if ([402, 403, 429].includes(error.status)) throw error;
  }

  return kept;
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
          // Gentle pacing so we stay inside the search service's limits.
          if (hits.length) await new Promise((r) => setTimeout(r, 7000));
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

    // --- Sift out boards, agencies and directories -------------------------
    // Keyword rules catch the obvious ones; this second pass judges the rest.
    const shortlist: SearchHit[] = [];
    const seenDomains = new Set<string>();
    for (const hit of hits) {
      const domain = apexDomain(hit.url);
      if (!domain || seenDomains.has(domain) || knownDomains.has(domain)) continue;
      if (looksLikeMiddleman(domain)) continue;
      if (!manualWebsite && ADVERT_WORDS.test(hit.title || "")) continue;
      seenDomains.add(domain);
      shortlist.push({ ...hit, url: `https://${domain}` });
    }

    const allowedDomains = manualWebsite
      ? new Set(shortlist.map((h) => apexDomain(h.url)!))
      : await keepRealEmployers(shortlist);

    // --- Turn pages into companies ----------------------------------------
    const added: string[] = [];

    for (const hit of shortlist) {
      if (added.length >= BATCH_LIMIT) break;

      const domain = apexDomain(hit.url)!;
      if (!allowedDomains.has(domain)) continue;


      const name = companyNameFrom(domain, hit.title);
      if (!name) continue;

      const key = normalise(name);
      if (knownNames.has(key)) continue;

      const website = `https://${domain}`;
      const careers = await findCareersPage(website);
      if (!careers) continue;
      // The careers page must live on the company's own site, not a board.
      if (apexDomain(careers) !== domain) continue;

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

    // --- Second pass: read the job boards ---------------------------------
    // Keeps only companies hiring for themselves; agencies are remembered and
    // never looked at again.
    const rejected: string[] = [];

    /** Remembers a rejected advertiser so later runs skip it instantly. */
    async function remember(name: string, domain: string | null, reason: string) {
      const key = normalise(name);
      if (!key || knownNames.has(key)) return;
      knownNames.add(key);
      if (domain) knownDomains.add(domain);
      await supabase.from("target_companies").insert({
        company_name: name,
        website: domain ? `https://${domain}` : null,
        is_active: false,
        excluded_reason: reason,
        discovered_from: "job board",
        notes: "Skipped automatically when reading the job boards",
      });
      rejected.push(name);
    }

    if (!manualWebsite && added.length < BATCH_LIMIT) {
      // A different pair of boards and work areas each night, so over a week we
      // cover them all without one long run.
      const night = new Date().getDate();
      const boardQueries = [0, 1].map((offset) => {
        const site = BOARD_SITES[(night + offset) % BOARD_SITES.length];
        const area = BOARD_AREAS[(night + offset) % BOARD_AREAS.length];
        return `${site} Bristol ${area} job`.replace(/\s+/g, " ").trim();
      });

      const listings: SearchHit[] = [];
      try {
        for (const query of boardQueries) {
          listings.push(...(await firecrawlSearch(query)));
        }
      } catch (error: any) {
        if ([402, 403, 429].includes(error?.status)) {
          await supabase.from("job_locks").upsert(
            {
              job_name: JOB_NAME,
              locked_until: new Date().toISOString(),
              paused_reason: `Board reading paused: ${error.message}`.slice(0, 300),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "job_name" },
          );
          return new Response(JSON.stringify({ added: added.length, companies: added, paused: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.error(error?.message ?? String(error));
      }

      for (const listing of listings) {
        if (added.length >= BATCH_LIMIT) break;

        let markdown: string | null = null;
        try {
          markdown = await firecrawlScrape(listing.url);
        } catch (error: any) {
          console.error(error?.message ?? String(error));
          break; // credit or rate limit: stop reading boards for tonight
        }
        if (!markdown) continue;

        // Test 1: who placed the advert?
        const advertiser = advertiserFrom(markdown, listing.title || "");
        if (!advertiser) continue;
        const key = normalise(advertiser);
        if (!key || knownNames.has(key)) continue;

        if (looksLikeAgencyName(advertiser)) {
          await remember(advertiser, null, "agency");
          continue;
        }

        // Test 2: does the advert read like an agency wrote it?
        if (advertWrittenByAgency(markdown)) {
          await remember(advertiser, null, "agency");
          continue;
        }

        // Only roles near Bristol.
        if (!mentionsBristol(`${listing.title} ${listing.description ?? ""} ${markdown.slice(0, 4000)}`)) continue;

        // Test 3: what does their own website say they do?
        let domain: string | null = null;
        try {
          domain = await resolveWebsite(advertiser);
        } catch (error: any) {
          console.error(error?.message ?? String(error));
          break;
        }
        if (!domain || knownDomains.has(domain)) continue;
        if (looksLikeMiddleman(domain)) {
          await remember(advertiser, domain, "agency");
          continue;
        }

        const judged = await keepRealEmployers([{ url: `https://${domain}`, title: advertiser }]);
        if (!judged.has(domain)) {
          await remember(advertiser, domain, "unverified");
          continue;
        }

        const website = `https://${domain}`;
        const careers = await findCareersPage(website);
        if (!careers || apexDomain(careers) !== domain) continue;

        const { error: insertError } = await supabase.from("target_companies").insert({
          company_name: advertiser,
          website,
          careers_page_url: careers,
          location: "Bristol",
          is_active: true,
          discovered_from: listing.url,
          notes: `Found advertising on a job board: ${listing.url}`,
        });

        if (insertError) {
          if (!insertError.message.includes("duplicate")) console.error("Could not add company:", insertError.message);
          continue;
        }

        knownNames.add(key);
        knownDomains.add(domain);
        added.push(advertiser);
      }
    }

    if (!manualWebsite) {
      await supabase
        .from("job_locks")
        .update({ locked_until: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("job_name", JOB_NAME);
    }

    return new Response(JSON.stringify({ added: added.length, companies: added, rejected: rejected.length }), {
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
