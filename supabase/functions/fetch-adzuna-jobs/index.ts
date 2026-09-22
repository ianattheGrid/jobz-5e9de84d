// Pulls Bristol vacancies from Adzuna's official UK feed.
// Company adverts only — anything posted by a recruitment agency is rejected
// and remembered so we never keep it again. Nothing is emailed from here.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const ADZUNA_APP_ID = Deno.env.get("ADZUNA_APP_ID");
const ADZUNA_APP_KEY = Deno.env.get("ADZUNA_APP_KEY");

const PAGES = 8;                 // 8 x 50 = up to 400 adverts a run
const RESULTS_PER_PAGE = 50;
const WHERE = "Bristol";
const DISTANCE_KM = 15;
const MAX_DAYS_OLD = 21;

const AGENCY_NAME_WORDS =
  /\b(recruit\w*|recruitment|resourcing|talent|staffing|search|selection|headhunt\w*|manpower|personnel|employment agency|agency|consultancy|consultants|hays|reed|adecco|randstad|michael page|robert half|pertemps|blue arrow|gi group|brook street|office angels|hire|jobs?)\b/i;

const NON_EMPLOYER_HINTS =
  /\b(confidential|private advertiser|client|undisclosed)\b/i;

function normalise(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function looksLikeAgency(name: string) {
  return AGENCY_NAME_WORDS.test(name) || NON_EMPLOYER_HINTS.test(name);
}

function tidyName(name: string) {
  return name
    .replace(/\s+/g, " ")
    .replace(/\s*\b(ltd|limited|plc|llp)\.?$/i, (m) => m)
    .trim()
    .slice(0, 120);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    return json({ error: "Adzuna credentials are not configured" }, 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Single-flight lease so two runs can't overlap.
  const now = new Date();
  const leaseUntil = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
  const { data: lock } = await supabase
    .from("job_locks")
    .select("locked_until, paused_reason")
    .eq("job_name", "fetch-adzuna-jobs")
    .maybeSingle();

  if (lock?.paused_reason) {
    return json({ paused: lock.paused_reason, added: 0 });
  }
  if (lock?.locked_until && new Date(lock.locked_until) > now) {
    return json({ skipped: "already running", added: 0 });
  }
  await supabase.from("job_locks").upsert({
    job_name: "fetch-adzuna-jobs",
    locked_until: leaseUntil,
    last_run_at: now.toISOString(),
    paused_reason: null,
  });

  const release = () =>
    supabase.from("job_locks").upsert({
      job_name: "fetch-adzuna-jobs",
      locked_until: new Date().toISOString(),
      last_run_at: new Date().toISOString(),
    });

  try {
    // Who we already know about.
    const { data: companies } = await supabase
      .from("target_companies")
      .select("id, company_name, excluded_reason");

    const byName = new Map<string, { id: string; excluded: string | null }>();
    for (const c of companies ?? []) {
      byName.set(normalise(c.company_name), {
        id: c.id,
        excluded: c.excluded_reason ?? null,
      });
    }

    const { data: existingJobs } = await supabase
      .from("external_jobs")
      .select("job_url");
    const seenUrls = new Set((existingJobs ?? []).map((j) => j.job_url));

    let addedJobs = 0;
    let addedCompanies = 0;
    let rejected = 0;
    let looked = 0;

    for (let page = 1; page <= PAGES; page++) {
      const url =
        `https://api.adzuna.com/v1/api/jobs/gb/search/${page}` +
        `?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}` +
        `&results_per_page=${RESULTS_PER_PAGE}` +
        `&where=${encodeURIComponent(WHERE)}&distance=${DISTANCE_KM}` +
        `&max_days_old=${MAX_DAYS_OLD}&sort_by=date&content-type=application/json`;

      const res = await fetch(url);
      if (res.status === 429) {
        await supabase.from("job_locks").upsert({
          job_name: "fetch-adzuna-jobs",
          locked_until: new Date().toISOString(),
          paused_reason: "Adzuna rate limit — will try again tomorrow",
        });
        break;
      }
      if (res.status === 401 || res.status === 403) {
        await supabase.from("job_locks").upsert({
          job_name: "fetch-adzuna-jobs",
          locked_until: new Date().toISOString(),
          paused_reason: "Adzuna rejected our key — check the application ID and key",
        });
        break;
      }
      if (!res.ok) break;

      const body = await res.json();
      const results: any[] = body?.results ?? [];
      if (results.length === 0) break;
      looked += results.length;

      for (const r of results) {
        const advertUrl: string | undefined = r.redirect_url;
        const rawName: string | undefined = r.company?.display_name;
        const title: string | undefined = r.title;
        if (!advertUrl || !rawName || !title) continue;
        if (seenUrls.has(advertUrl)) continue;

        const companyName = tidyName(rawName);
        const key = normalise(companyName);
        if (!key) continue;

        const known = byName.get(key);
        if (known?.excluded) continue;

        if (!known && looksLikeAgency(companyName)) {
          // Remember the middleman so we stop looking at their adverts.
          const { data: inserted } = await supabase
            .from("target_companies")
            .insert({
              company_name: companyName,
              careers_page_url: advertUrl,
              location: r.location?.display_name ?? "Bristol",
              is_active: false,
              excluded_reason: "agency",
              discovered_from: "adzuna",
              notes: "Rejected from the Adzuna feed — looks like a recruitment agency",
            })
            .select("id")
            .maybeSingle();
          byName.set(key, { id: inserted?.id ?? "", excluded: "agency" });
          rejected++;
          continue;
        }

        let companyId = known?.id;
        if (!companyId) {
          const { data: inserted, error } = await supabase
            .from("target_companies")
            .insert({
              company_name: companyName,
              careers_page_url: advertUrl,
              location: r.location?.display_name ?? "Bristol",
              is_active: false, // no careers page of their own yet
              discovered_from: "adzuna",
              notes: "Found advertising in Bristol on the Adzuna feed",
            })
            .select("id")
            .maybeSingle();
          if (error || !inserted) continue;
          companyId = inserted.id;
          byName.set(key, { id: companyId, excluded: null });
          addedCompanies++;
        }

        const clean = String(title).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        const { error: jobError } = await supabase.from("external_jobs").insert({
          company_id: companyId,
          job_title: clean.slice(0, 200),
          job_description: r.description
            ? String(r.description).replace(/<[^>]*>/g, "").slice(0, 2000)
            : null,
          location: r.location?.display_name ?? "Bristol",
          job_url: advertUrl,
          salary_min: r.salary_min ? Math.round(r.salary_min) : null,
          salary_max: r.salary_max ? Math.round(r.salary_max) : null,
          contract_type: r.contract_time ?? null,
          posting_date: r.created ?? null,
          is_active: true,
        });
        if (!jobError) {
          seenUrls.add(advertUrl);
          addedJobs++;
        }
      }
    }

    await release();
    return json({ looked, added_jobs: addedJobs, added_companies: addedCompanies, rejected });
  } catch (e) {
    await release();
    return json({ error: String(e) }, 500);
  }
});
