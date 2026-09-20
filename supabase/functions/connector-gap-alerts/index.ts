// Weekly agent: tells Connectors which kinds of people employers are looking for
// and we don't have enough of yet. Emails Connectors only — never candidates.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";
import { EMAIL_FROM_ALERTS, EMAIL_REPLY_TO } from "../_shared/email.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = "https://jobz.lovable.app";

const JOB_NAME = "connector-gap-alerts";
const LOCK_MINUTES = 15;
const THIN_POOL = 3; // fewer candidates than this counts as a gap
const MAX_GAPS = 8;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  try {
    const { data: lock } = await supabase
      .from("job_locks")
      .select("*")
      .eq("job_name", JOB_NAME)
      .maybeSingle();

    if (lock?.paused_reason) {
      return new Response(JSON.stringify({ skipped: true, reason: lock.paused_reason }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    if (lock && new Date(lock.locked_until) > now) {
      return new Response(JSON.stringify({ skipped: true, reason: "already running" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("job_locks").upsert(
      {
        job_name: JOB_NAME,
        locked_until: new Date(now.getTime() + LOCK_MINUTES * 60_000).toISOString(),
        last_run_at: now.toISOString(),
      },
      { onConflict: "job_name" },
    );

    // What are employers actually searching for?
    const { data: searches } = await supabase
      .from("employer_searches")
      .select("work_area, specialization")
      .eq("is_active", true)
      .limit(200);

    const demand = new Map<string, { work_area: string; specialization: string | null; employers: number }>();
    for (const s of searches || []) {
      if (!s.work_area) continue;
      const key = `${s.work_area}::${s.specialization ?? ""}`;
      const entry = demand.get(key) || { work_area: s.work_area, specialization: s.specialization, employers: 0 };
      entry.employers += 1;
      demand.set(key, entry);
    }

    const gaps: { label: string; employers: number; have: number }[] = [];
    for (const entry of demand.values()) {
      if (gaps.length >= MAX_GAPS) break;
      let query = supabase
        .from("candidate_profiles")
        .select("id", { count: "exact", head: true })
        .eq("workArea", entry.work_area);
      if (entry.specialization) query = query.eq("itSpecialization", entry.specialization);
      const { count } = await query;
      const have = count ?? 0;
      if (have < THIN_POOL) {
        gaps.push({
          label: entry.specialization ? `${entry.work_area} — ${entry.specialization}` : entry.work_area,
          employers: entry.employers,
          have,
        });
      }
    }

    if (gaps.length === 0) {
      return new Response(JSON.stringify({ sent: 0, reason: "no gaps" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: connectors } = await supabase
      .from("virtual_recruiter_profiles")
      .select("email, full_name")
      .eq("is_active", true);

    if (!connectors?.length || !RESEND_API_KEY) {
      return new Response(JSON.stringify({ sent: 0, reason: "nobody to email" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows = gaps
      .map(
        (g) =>
          `<li><strong>${g.label}</strong> — ${g.employers} ${g.employers === 1 ? "employer is" : "employers are"} looking, we have ${g.have}.</li>`,
      )
      .join("");

    let sent = 0;
    for (const c of connectors) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: EMAIL_FROM_ALERTS,
          reply_to: EMAIL_REPLY_TO,
          to: [c.email],
          subject: "People we're short of this week",
          html: `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;">
            <p>Hello ${c.full_name?.split(" ")[0] || "there"},</p>
            <p>Employers on Jobz are searching for these and we haven't got enough people signed up:</p>
            <ul>${rows}</ul>
            <p><a href="${SITE_URL}/vr/dashboard">Recommend someone</a></p>
            <p style="color:#666;font-size:13px;">You're getting this because you're a Jobz Connector. Turn it off in your dashboard settings.</p>
          </div>`,
        }),
      });
      if (response.ok) sent += 1;
      else console.error("Connector gap email rejected:", await response.text());
    }

    await supabase
      .from("job_locks")
      .update({ locked_until: new Date().toISOString() })
      .eq("job_name", JOB_NAME);

    return new Response(JSON.stringify({ sent, gaps: gaps.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("connector-gap-alerts failed:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
