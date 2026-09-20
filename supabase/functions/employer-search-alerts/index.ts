// Daily shortlist email for employers with a saved search set to "email me new matches".
// Runs on a schedule; sends at most one email per saved search per day.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";
import { EMAIL_FROM_ALERTS, EMAIL_REPLY_TO } from "../_shared/email.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = "https://jobz.lovable.app";

interface Candidate {
  id: string;
  full_name: string | null;
  job_title: string | null;
  desired_job_title: string | null;
  years_experience: number | null;
  min_salary: number | null;
  max_salary: number | null;
  location: string[] | null;
  required_skills: string[] | null;
  workArea: string | null;
  itSpecialization: string | null;
  availability_status: string | null;
  created_at: string;
}

/** Plain-English reasons this person came up, mirroring what the search page shows. */
function explain(search: any, c: Candidate) {
  const reasons: string[] = [];
  const gaps: string[] = [];

  if (search.work_area && c.workArea === search.work_area) reasons.push(`Works in ${search.work_area}`);
  if (search.specialization && c.itSpecialization === search.specialization) {
    reasons.push(`Specialises in ${search.specialization}`);
  } else if (search.specialization) {
    gaps.push(`Specialism is ${c.itSpecialization || "not stated"}, not ${search.specialization}`);
  }

  const wanted: string[] = search.required_skills || [];
  if (wanted.length) {
    const have = (c.required_skills || []).map((s) => s.toLowerCase());
    const matched = wanted.filter((s) => have.includes(s.toLowerCase()));
    if (matched.length) reasons.push(`Has ${matched.join(", ")}`);
    const missing = wanted.filter((s) => !have.includes(s.toLowerCase()));
    if (missing.length) gaps.push(`No mention of ${missing.join(", ")}`);
  }

  if (search.max_salary && c.min_salary && c.min_salary <= search.max_salary) {
    reasons.push(`Salary expectation fits your range`);
  } else if (search.max_salary && c.min_salary) {
    gaps.push(`Wants from £${c.min_salary.toLocaleString()}`);
  }

  if (c.availability_status === "actively_looking") reasons.push("Actively looking right now");

  return { reasons, gaps };
}

function renderEmail(searchLabel: string, rows: { c: Candidate; reasons: string[]; gaps: string[] }[]) {
  const people = rows
    .map(({ c, reasons, gaps }) => `
      <tr><td style="padding:16px 0;border-bottom:1px solid #eee;">
        <div style="font-size:16px;font-weight:600;">${c.full_name || "Candidate"}</div>
        <div style="color:#555;">${c.desired_job_title || c.job_title || "Role not stated"}${
          c.years_experience ? ` · ${c.years_experience} years' experience` : ""
        }${Array.isArray(c.location) && c.location.length ? ` · ${c.location.join(", ")}` : ""}</div>
        ${reasons.map((r) => `<div style="color:#137a3f;font-size:14px;">✓ ${r}</div>`).join("")}
        ${gaps.map((g) => `<div style="color:#946200;font-size:14px;">! ${g}</div>`).join("")}
      </td></tr>`)
    .join("");

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;">
    <h2 style="margin-bottom:4px;">New people who fit your search</h2>
    <p style="color:#555;margin-top:0;">${searchLabel} — ${rows.length} new ${rows.length === 1 ? "person" : "people"} since your last email.</p>
    <table style="width:100%;border-collapse:collapse;">${people}</table>
    <p style="margin-top:24px;">
      <a href="${SITE_URL}/employer/candidate-search"
         style="background:#FF69B4;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">
        See them on Jobz
      </a>
    </p>
    <p style="color:#888;font-size:12px;margin-top:24px;">
      You're getting this because you switched on daily alerts for a saved search. Turn it off any time on the candidate search page.
    </p>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  const summary = { searches: 0, emailsSent: 0, errors: [] as string[] };

  try {
    const { data: searches, error } = await supabase
      .from("employer_searches")
      .select("*")
      .eq("is_active", true)
      .eq("alert_frequency", "daily");

    if (error) throw error;

    for (const search of searches || []) {
      summary.searches++;
      try {
        const since = search.last_alert_sent_at
          ? new Date(search.last_alert_sent_at)
          : new Date(Date.now() - 24 * 60 * 60 * 1000);

        let query = supabase
          .from("candidate_profiles")
          .select(
            "id, full_name, job_title, desired_job_title, years_experience, min_salary, max_salary, location, required_skills, workArea, itSpecialization, availability_status, created_at",
          )
          .gt("created_at", since.toISOString())
          .neq("availability_status", "not_looking")
          .limit(10);

        if (search.work_area) query = query.eq("workArea", search.work_area);
        if (search.specialization) query = query.eq("itSpecialization", search.specialization);
        if (search.max_salary) query = query.lte("min_salary", search.max_salary);

        const { data: candidates, error: candErr } = await query;
        if (candErr) throw candErr;

        // Always move the marker forward so we never re-send the same people.
        await supabase
          .from("employer_searches")
          .update({ last_alert_sent_at: new Date().toISOString() })
          .eq("id", search.id);

        if (!candidates || candidates.length === 0) continue;

        const { data: userData } = await supabase.auth.admin.getUserById(search.employer_id);
        const to = userData?.user?.email;
        if (!to) continue;

        const rows = (candidates as Candidate[]).map((c) => ({ c, ...explain(search, c) }));
        const label = [search.work_area, search.specialization].filter(Boolean).join(" · ") || "Your saved search";

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: EMAIL_FROM_ALERTS,
            reply_to: EMAIL_REPLY_TO,
            to: [to],
            subject: `${candidates.length} new ${candidates.length === 1 ? "person" : "people"} match your Jobz search`,
            html: renderEmail(label, rows),
          }),
        });

        if (!res.ok) {
          summary.errors.push(`resend ${res.status}: ${await res.text()}`);
        } else {
          summary.emailsSent++;
        }
      } catch (e) {
        summary.errors.push(String(e));
      }
    }

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("employer-search-alerts error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
