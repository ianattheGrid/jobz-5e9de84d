// Monday morning summary for the Jobz admins: who joined, where from, and
// what is waiting for approval. Read-only — it never contacts anybody else.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";
import { EMAIL_FROM_ALERTS, EMAIL_REPLY_TO } from "../_shared/email.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = "https://jobz.lovable.app";

const SOURCE_LABELS: Record<string, string> = {
  invite_link: "Invite link",
  cv_review: "Free CV review",
  salary_tool: "Salary check",
  employer_email: "Our email to them",
  shared_profile: "A shared profile",
  direct: "Came straight to the site",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString();

    const [candidates, employers, invites, waiting, sent] = await Promise.all([
      supabase.from("candidate_profiles").select("signup_source").gte("created_at", since),
      supabase.from("employer_profiles").select("signup_source").gte("created_at", since),
      supabase.from("invite_signups").select("id", { count: "exact", head: true }).gte("created_at", since),
      supabase.from("employer_prospects").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("employer_prospects").select("id", { count: "exact", head: true }).gte("sent_at", since),
    ]);

    const counts = new Map<string, number>();
    for (const row of [...(candidates.data || []), ...(employers.data || [])]) {
      const key = (row as any).signup_source || "direct";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const sourceRows = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([key, n]) => `<li>${SOURCE_LABELS[key] ?? key}: <strong>${n}</strong></li>`)
      .join("") || "<li>Nobody new this week.</li>";

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;color:#222;">
        <h2 style="margin-bottom:4px;">Jobz — the last seven days</h2>
        <p style="color:#666;margin-top:0;">Your daily round-up.</p>
        <p>
          <strong>${candidates.data?.length ?? 0}</strong> new candidates ·
          <strong>${employers.data?.length ?? 0}</strong> new employers ·
          <strong>${invites.count ?? 0}</strong> through invite links
        </p>
        <h3>Where they came from</h3>
        <ul>${sourceRows}</ul>
        <h3>Waiting for you</h3>
        <p><strong>${waiting.count ?? 0}</strong> employers ready to approve. We emailed <strong>${sent.count ?? 0}</strong> last week.</p>
        <p><a href="${SITE_URL}/admin/growth" style="background:#FF2E88;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Open the approval list</a></p>
      </div>`;

    const { data: admins } = await supabase.from("admins").select("email");
    const to = (admins || []).map((a: any) => a.email).filter(Boolean);

    if (!to.length || !RESEND_API_KEY) {
      return json({ sent: 0, reason: "nobody to email" });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: EMAIL_FROM_ALERTS,
        reply_to: EMAIL_REPLY_TO,
        to,
        subject: "Jobz — your Monday round-up",
        html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("growth-digest rejected:", detail);
      return json({ error: "The email provider rejected that message.", details: detail }, 502);
    }

    return json({ sent: to.length });
  } catch (error: any) {
    console.error("growth-digest failed:", error);
    return json({ error: error.message }, 500);
  }
});
