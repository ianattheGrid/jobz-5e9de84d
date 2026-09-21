// Nightly agent: builds a queue of Bristol employers who are advertising jobs in
// public, so an admin can decide whether to invite them to Jobz.
// It never emails anyone — approval and sending happen separately.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const JOB_NAME = "find-employer-prospects";
const BATCH_LIMIT = 25; // hard cap on prospects created per run
const LOCK_MINUTES = 15;
const AGENCY_FEE_RATE = 0.2;

function normalise(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const GENERIC_PREFIXES = ["careers", "jobs", "recruitment", "hr", "people", "hello", "info", "enquiries", "contact"];

/**
 * Looks for a published business contact address on the company's own site.
 * Business contact details only — never anything belonging to a named person.
 */
async function findContactEmail(website: string | null): Promise<{ email: string; source: string } | null> {
  if (!website) return null;

  let base: URL;
  try {
    base = new URL(website.startsWith("http") ? website : `https://${website}`);
  } catch {
    return null;
  }

  const paths = ["/contact", "/contact-us", "/careers", "/jobs", "/"];

  for (const path of paths) {
    try {
      const target = new URL(path, base).toString();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(target, {
        signal: controller.signal,
        headers: { "User-Agent": "JobzBot/1.0 (+https://jobz.lovable.app)" },
      });
      clearTimeout(timer);
      if (!response.ok) continue;

      const html = (await response.text()).slice(0, 200_000);
      const matches = [...html.matchAll(/mailto:([^"'?\s>]+@[^"'?\s>]+)/gi)].map((m) =>
        m[1].toLowerCase().trim(),
      );
      if (!matches.length) continue;

      // Prefer a general business inbox over anything that looks personal.
      const generic = matches.find((e) => GENERIC_PREFIXES.some((p) => e.startsWith(`${p}@`)));
      const chosen = generic ?? matches[0];
      if (!chosen.includes("@")) continue;

      return { email: chosen, source: target };
    } catch (_e) {
      continue;
    }
  }

  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  try {
    // --- Paused? -----------------------------------------------------------
    const { data: lock } = await supabase
      .from("job_locks")
      .select("*")
      .eq("job_name", JOB_NAME)
      .maybeSingle();

    if (lock?.paused_reason) {
      return new Response(
        JSON.stringify({ skipped: true, reason: lock.paused_reason }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // --- Single flight -----------------------------------------------------
    const now = new Date();
    const lockedUntil = new Date(now.getTime() + LOCK_MINUTES * 60_000).toISOString();

    if (lock && new Date(lock.locked_until) > now) {
      return new Response(JSON.stringify({ skipped: true, reason: "already running" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: lockError } = await supabase
      .from("job_locks")
      .upsert(
        { job_name: JOB_NAME, locked_until: lockedUntil, last_run_at: now.toISOString(), updated_at: now.toISOString() },
        { onConflict: "job_name" },
      );
    if (lockError) throw lockError;

    // --- Who is already on Jobz, and who have we seen before? --------------
    const [{ data: employers }, { data: existing }] = await Promise.all([
      supabase.from("employer_profiles").select("company_name"),
      supabase.from("employer_prospects").select("source_url, company_name"),
    ]);

    const onJobz = new Set((employers || []).map((e: any) => normalise(e.company_name || "")));
    const seenUrls = new Set((existing || []).map((p: any) => p.source_url));
    const seenCompanies = new Set((existing || []).map((p: any) => normalise(p.company_name || "")));

    // --- Hiring signals: how busy has each company been lately? ------------
    // Company facts from public adverts only — nothing about any individual.
    const signalSince = new Date(now.getTime() - 30 * 24 * 60 * 60_000).toISOString();
    const { data: recentAdverts } = await supabase
      .from("external_jobs")
      .select("company_id, scraped_at")
      .eq("is_active", true)
      .gte("scraped_at", signalSince)
      .limit(2000);

    const advertCounts = new Map<string, number>();
    for (const row of recentAdverts || []) {
      const id = (row as any).company_id;
      if (!id) continue;
      advertCounts.set(id, (advertCounts.get(id) ?? 0) + 1);
    }

    // --- How many people looked at each advert here in the last week? ------
    // A count only: nothing about who looked.
    const viewsSince = new Date(now.getTime() - 7 * 24 * 60 * 60_000).toISOString();
    const { data: recentViews } = await supabase
      .from("external_job_views")
      .select("external_job_id")
      .gte("viewed_at", viewsSince)
      .limit(5000);

    const viewCounts = new Map<string, number>();
    for (const row of recentViews || []) {
      const id = (row as any).external_job_id;
      if (!id) continue;
      viewCounts.set(id, (viewCounts.get(id) ?? 0) + 1);
    }

    /** A short, plain "why now" line an admin can actually use. */
    function signalFor(job: any) {
      const count = advertCounts.get(job.company_id) ?? 1;
      const posted = job.scraped_at ? new Date(job.scraped_at) : now;
      const daysOld = Math.floor((now.getTime() - posted.getTime()) / 86_400_000);

      if (count >= 5) {
        return { kind: "hiring_burst", summary: `Advertising ${count} roles in the last 30 days`, at: posted };
      }
      if (count >= 2) {
        return { kind: "hiring_volume", summary: `Advertising ${count} roles in the last 30 days`, at: posted };
      }
      return {
        kind: "new_advert",
        summary: daysOld <= 1 ? "Posted a role today" : `Posted a role ${daysOld} days ago`,
        at: posted,
      };
    }

    // --- Recently advertised roles ----------------------------------------
    const since = new Date(now.getTime() - 7 * 24 * 60 * 60_000).toISOString();
    const { data: jobs, error: jobsError } = await supabase
      .from("external_jobs")
      .select("id, job_title, location, salary_min, salary_max, job_url, scraped_at, company_id, target_companies(company_name, website, location)")
      .eq("is_active", true)
      .gte("scraped_at", since)
      .order("scraped_at", { ascending: false })
      .limit(300);
    if (jobsError) throw jobsError;

    // Strongest reason to get in touch first.
    const sortedJobs = [...(jobs || [])].sort(
      (a: any, b: any) => (advertCounts.get(b.company_id) ?? 0) - (advertCounts.get(a.company_id) ?? 0),
    );

    const created: string[] = [];

    for (const job of sortedJobs) {
      if (created.length >= BATCH_LIMIT) break;

      const company = (job as any).target_companies;
      const companyName: string | undefined = company?.company_name;
      if (!companyName) continue;

      const key = normalise(companyName);
      if (onJobz.has(key) || seenCompanies.has(key) || seenUrls.has(job.job_url)) continue;

      const salary = job.salary_max || job.salary_min || null;

      // Published business contact address on the company's own site, if there is one.
      const contact = await findContactEmail(company?.website || null);
      const signal = signalFor(job);

      const { error: insertError } = await supabase.from("employer_prospects").insert({
        company_name: companyName,
        company_website: company?.website || null,
        contact_email: contact?.email || null,
        contact_source: contact?.source || null,
        role_title: job.job_title,
        role_location: job.location || company?.location || null,
        source_url: job.job_url,
        source: "external_jobs",
        estimated_salary: salary,
        estimated_agency_fee: salary ? Math.round(salary * AGENCY_FEE_RATE) : null,
        status: "new",
        signal_kind: signal.kind,
        signal_summary: signal.summary,
        signal_source_url: job.job_url,
        signal_at: signal.at.toISOString(),
        advert_views_7d: viewCounts.get((job as any).id) ?? 0,
      });

      // A duplicate simply means another run already queued it.
      if (insertError && !insertError.message.includes("duplicate")) {
        console.error("Could not queue prospect:", insertError.message);
        continue;
      }

      seenCompanies.add(key);
      seenUrls.add(job.job_url);
      created.push(companyName);
    }

    // Keep the interest count fresh on prospects that are still waiting.
    if (viewCounts.size) {
      const { data: waiting } = await supabase
        .from("employer_prospects")
        .select("id, source_url")
        .eq("status", "new");

      const urlToJobId = new Map((jobs || []).map((j: any) => [j.job_url, j.id]));
      for (const row of waiting || []) {
        const jobId = urlToJobId.get((row as any).source_url);
        const count = jobId ? viewCounts.get(jobId) ?? 0 : 0;
        if (count > 0) {
          await supabase.from("employer_prospects").update({ advert_views_7d: count }).eq("id", (row as any).id);
        }
      }
    }

    await supabase
      .from("job_locks")
      .update({ locked_until: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("job_name", JOB_NAME);

    return new Response(JSON.stringify({ created: created.length, companies: created }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("find-employer-prospects failed:", error);
    await supabase
      .from("job_locks")
      .upsert(
        { job_name: JOB_NAME, locked_until: new Date().toISOString(), paused_reason: `Failed: ${error.message}`.slice(0, 300), updated_at: new Date().toISOString() },
        { onConflict: "job_name" },
      );
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
