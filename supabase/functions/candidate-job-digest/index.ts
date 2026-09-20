// Weekly "roles that fit you" email for candidates who haven't opted out.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";
import { EMAIL_FROM_ALERTS, EMAIL_REPLY_TO } from "../_shared/email.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = "https://jobz.lovable.app";

function renderEmail(name: string, jobs: any[]) {
  const items = jobs
    .map((j) => `
      <tr><td style="padding:14px 0;border-bottom:1px solid #eee;">
        <div style="font-size:16px;font-weight:600;">${j.title}</div>
        <div style="color:#555;">${j.company} · ${j.location}</div>
        <div style="color:#555;">£${(j.salary_min ?? 0).toLocaleString()} – £${(j.salary_max ?? 0).toLocaleString()}</div>
      </td></tr>`)
    .join("");

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;">
    <h2 style="margin-bottom:4px;">Roles that fit you this week${name ? `, ${name}` : ""}</h2>
    <p style="color:#555;margin-top:0;">Straight from the employer. No agency in the middle.</p>
    <table style="width:100%;border-collapse:collapse;">${items}</table>
    <p style="margin-top:24px;">
      <a href="${SITE_URL}/candidate/jobs"
         style="background:#FF69B4;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">
        View these roles
      </a>
    </p>
    <p style="color:#888;font-size:12px;margin-top:24px;">
      Don't want these? Turn off weekly role emails in your Jobz account settings.
    </p>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  const summary = { candidates: 0, emailsSent: 0, errors: [] as string[] };

  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: candidates, error } = await supabase
      .from("candidate_profiles")
      .select("id, full_name, email, workArea, itSpecialization, min_salary, location, availability_status, last_job_digest_sent_at")
      .eq("weekly_job_email", true)
      .neq("availability_status", "not_looking")
      .or(`last_job_digest_sent_at.is.null,last_job_digest_sent_at.lt.${weekAgo}`)
      .limit(500);

    if (error) throw error;

    for (const c of candidates || []) {
      summary.candidates++;
      try {
        let query = supabase
          .from("jobs")
          .select("id, title, company, location, salary_min, salary_max, work_area, specialization")
          .order("created_at", { ascending: false })
          .limit(5);

        if (c.workArea) query = query.eq("work_area", c.workArea);
        if (c.min_salary) query = query.gte("salary_max", c.min_salary);

        const { data: jobs } = await query;

        await supabase
          .from("candidate_profiles")
          .update({ last_job_digest_sent_at: new Date().toISOString() })
          .eq("id", c.id);

        if (!jobs || jobs.length === 0 || !c.email) continue;

        const firstName = (c.full_name || "").split(" ")[0] || "";

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: EMAIL_FROM_ALERTS,
            reply_to: EMAIL_REPLY_TO,
            to: [c.email],
            subject: `${jobs.length} ${jobs.length === 1 ? "role" : "roles"} that fit you on Jobz`,
            html: renderEmail(firstName, jobs),
          }),
        });

        if (!res.ok) summary.errors.push(`resend ${res.status}: ${await res.text()}`);
        else summary.emailsSent++;
      } catch (e) {
        summary.errors.push(String(e));
      }
    }

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("candidate-job-digest error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
