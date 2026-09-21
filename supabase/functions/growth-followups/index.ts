// Sends the single "come back" email to people who asked to hear from us
// after using the free CV review or salary check. One email each, ever.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";
import { EMAIL_FROM, EMAIL_REPLY_TO } from "../_shared/email.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = "https://jobz.lovable.app";

const JOB_NAME = "growth-followups";
const BATCH_LIMIT = 40;
const LOCK_MINUTES = 15;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

function renderEmail(kind: string, searches: number) {
  const demand =
    searches > 0
      ? `<p>In the last week <strong>${searches}</strong> Bristol ${searches === 1 ? "employer has" : "employers have"} been searching for people on Jobz.</p>`
      : "";

  const opener =
    kind === "salary_tool"
      ? "You checked what a role was worth on Jobz a little while ago."
      : "You used our free CV review a little while ago.";

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;color:#222;">
    <p>Hello,</p>
    <p>${opener} You never set up a profile, so nobody can find you yet.</p>
    ${demand}
    <p>A Jobz profile is free, takes a couple of minutes, and gives you a link you can put in your LinkedIn bio. Employers come to you directly — no agency, no fee, no applying into the void.</p>
    <p><a href="${SITE_URL}/candidate/signup?from=${kind}" style="background:#FF2E88;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Set up my free profile</a></p>
    <p style="color:#666;font-size:13px;">This is the only follow-up you'll get from us — there's no mailing list and no chasing. Reply "no thanks" and we'll never contact you again.</p>
    <p>Ian<br/>Jobz</p>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  try {
    const { data: lock } = await supabase
      .from("job_locks")
      .select("*")
      .eq("job_name", JOB_NAME)
      .maybeSingle();

    if (lock?.paused_reason) return json({ skipped: true, reason: lock.paused_reason });

    const now = new Date();
    if (lock && new Date(lock.locked_until) > now) return json({ skipped: true, reason: "already running" });

    await supabase.from("job_locks").upsert(
      {
        job_name: JOB_NAME,
        locked_until: new Date(now.getTime() + LOCK_MINUTES * 60_000).toISOString(),
        last_run_at: now.toISOString(),
      },
      { onConflict: "job_name" },
    );

    const { data: due, error: dueError } = await supabase
      .from("growth_followups")
      .select("id, email, kind")
      .is("sent_at", null)
      .eq("suppressed", false)
      .lte("due_at", now.toISOString())
      .limit(BATCH_LIMIT);
    if (dueError) throw dueError;

    if (!due?.length) return json({ sent: 0, reason: "nothing due" });
    if (!RESEND_API_KEY) return json({ error: "Email sending is not configured yet." }, 500);

    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60_000).toISOString();
    const { count: searches } = await supabase
      .from("employer_searches")
      .select("id", { count: "exact", head: true })
      .gte("created_at", weekAgo);

    let sent = 0;

    for (const row of due) {
      const email = row.email.toLowerCase();

      // Never email somebody who has asked us not to, or who has since joined.
      const [{ data: suppressed }, { data: already }] = await Promise.all([
        supabase.from("outreach_suppressions").select("id").eq("email", email).maybeSingle(),
        supabase.from("candidate_profiles").select("id").eq("email", email).maybeSingle(),
      ]);

      if (suppressed || already) {
        await supabase.from("growth_followups").update({ suppressed: true }).eq("id", row.id);
        continue;
      }

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: EMAIL_FROM,
          reply_to: EMAIL_REPLY_TO,
          to: [row.email],
          subject: "Bristol employers are searching — you're not on the list yet",
          html: renderEmail(row.kind, searches ?? 0),
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        console.error(`Follow-up rejected [${response.status}]: ${detail}`);
        // Stop the batch rather than hammering a failing provider.
        await supabase
          .from("job_locks")
          .upsert(
            {
              job_name: JOB_NAME,
              locked_until: new Date().toISOString(),
              paused_reason: `Email provider error: ${response.status}`.slice(0, 300),
            },
            { onConflict: "job_name" },
          );
        return json({ sent, error: "Provider request failed", status: response.status, details: detail }, 502);
      }

      await supabase.from("growth_followups").update({ sent_at: new Date().toISOString() }).eq("id", row.id);
      sent += 1;
    }

    await supabase
      .from("job_locks")
      .update({ locked_until: new Date().toISOString() })
      .eq("job_name", JOB_NAME);

    return json({ sent });
  } catch (error: any) {
    console.error("growth-followups failed:", error);
    return json({ error: error.message }, 500);
  }
});
