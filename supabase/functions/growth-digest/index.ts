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

    const [candidates, employers, invites, waiting, needEmail, sent, messages] = await Promise.all([
      supabase.from("candidate_profiles").select("signup_source").gte("created_at", since),
      supabase.from("employer_profiles").select("signup_source").gte("created_at", since),
      supabase.from("invite_signups").select("id", { count: "exact", head: true }).gte("created_at", since),
      supabase
        .from("employer_prospects")
        .select("id", { count: "exact", head: true })
        .eq("status", "new")
        .not("contact_email", "is", null),
      supabase
        .from("employer_prospects")
        .select("id", { count: "exact", head: true })
        .eq("status", "new")
        .is("contact_email", null),
      supabase.from("employer_prospects").select("id", { count: "exact", head: true }).gte("sent_at", since),
      supabase.from("contact_submissions").select("id", { count: "exact", head: true }).gte("created_at", since),
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

    // One short list of things that need a decision, each a button straight to it.
    const actionRow = (label: string, href: string) => `
      <tr><td style="padding:6px 0;">
        <a href="${href}" style="display:block;background:#12122A;color:#fff;border:1px solid #FF2E88;padding:12px 16px;border-radius:10px;text-decoration:none;">${label} →</a>
      </td></tr>`;

    const actions: string[] = [];
    if ((waiting.count ?? 0) > 0) {
      actions.push(actionRow(`${waiting.count} employer${waiting.count === 1 ? "" : "s"} ready to approve`, `${SITE_URL}/admin/growth`));
    }
    if ((needEmail.count ?? 0) > 0) {
      actions.push(actionRow(`${needEmail.count} waiting for a contact address`, `${SITE_URL}/admin/growth`));
    }
    if ((messages.count ?? 0) > 0) {
      actions.push(actionRow(`${messages.count} new message${messages.count === 1 ? "" : "s"} through the contact form`, `${SITE_URL}/admin`));
    }
    const actionBlock = actions.length
      ? `<table style="width:100%;border-collapse:collapse;">${actions.join("")}</table>`
      : `<p style="color:#666;">Nothing needs you today.</p>`;

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;color:#222;">
        <h2 style="margin-bottom:4px;">Jobz — the last seven days</h2>
        <p style="color:#666;margin-top:0;">Your daily round-up.</p>
        <h3>Needs you</h3>
        ${actionBlock}
        <p>
          <strong>${candidates.data?.length ?? 0}</strong> new candidates ·
          <strong>${employers.data?.length ?? 0}</strong> new employers ·
          <strong>${invites.count ?? 0}</strong> through invite links
        </p>
        <h3>Where they came from</h3>
        <ul>${sourceRows}</ul>
        <p style="color:#666;">We emailed <strong>${sent.count ?? 0}</strong> employers in the last week. One message each, never a chase.</p>
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
        subject: "Jobz — your daily round-up",
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
