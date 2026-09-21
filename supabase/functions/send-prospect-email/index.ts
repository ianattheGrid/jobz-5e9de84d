// Sends ONE invitation email to an employer prospect, only when an admin has
// approved it in the admin area. No sequences, no automatic follow-ups.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";
import { EMAIL_FROM, EMAIL_REPLY_TO } from "../_shared/email.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = "https://jobz.lovable.app";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

function renderEmail(p: any) {
  const fee = p.estimated_agency_fee
    ? `<p>On a ${p.role_title || "role"} like that, a 20% agency fee would be about <strong>£${p.estimated_agency_fee.toLocaleString()}</strong>.</p>`
    : "";

  // Only said when it's actually true — never padded out.
  const views = p.advert_views_7d && p.advert_views_7d > 0
    ? `<p><strong>${p.advert_views_7d} ${p.advert_views_7d === 1 ? "person" : "people"}</strong> looking for work in Bristol opened your ${p.role_title || "role"} advert on Jobz this week. On Jobz you'd see them for £9 a month — no contract, no fee when you hire.</p>`
    : "";

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;color:#222;">
    <p>Hello ${p.company_name},</p>
    <p>I saw you're advertising ${p.role_title ? `for a ${p.role_title}` : "a role"}${p.role_location ? ` in ${p.role_location}` : ""}.</p>
    ${views}
    ${fee}
    <p>Jobz is a Bristol hiring site for small businesses: <strong>£9 a month, no contract, no commission and no agency in the middle</strong>. Candidates apply to you directly.</p>
    <p><a href="${SITE_URL}/employer/signup" style="background:#FF2E88;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Have a look at Jobz</a></p>
    <p style="color:#666;font-size:13px;">This is a one-off message from a person, not a mailing list — you won't hear from us again unless you reply. If you'd rather we never contacted you, reply with "no thanks" and we'll add you to our do-not-contact list.</p>
    <p>Ian<br/>Jobz</p>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "You need to be signed in." }, 401);

    const caller = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await caller.auth.getUser();
    const user = userData?.user;
    if (!user) return json({ error: "You need to be signed in." }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: isAdmin } = await admin
      .from("admins")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();
    if (!isAdmin) return json({ error: "Only an admin can send these." }, 403);

    const { prospectId } = await req.json();
    if (!prospectId) return json({ error: "Missing prospect." }, 400);

    const { data: prospect } = await admin
      .from("employer_prospects")
      .select("*")
      .eq("id", prospectId)
      .maybeSingle();
    if (!prospect) return json({ error: "That prospect no longer exists." }, 404);
    if (prospect.sent_at) return json({ error: "That prospect has already been emailed." }, 409);
    if (!prospect.contact_email) return json({ error: "Add a contact email address first." }, 400);

    const { data: suppressed } = await admin
      .from("outreach_suppressions")
      .select("id")
      .eq("email", prospect.contact_email.toLowerCase())
      .maybeSingle();
    if (suppressed) return json({ error: "That address is on the do-not-contact list." }, 409);

    if (!RESEND_API_KEY) return json({ error: "Email sending is not configured yet." }, 500);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        reply_to: EMAIL_REPLY_TO,
        to: [prospect.contact_email],
        subject: `A cheaper way to fill your ${prospect.role_title || "vacancy"}`,
        html: renderEmail(prospect),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Resend rejected prospect email:", detail);
      return json({ error: "The email provider rejected that message." }, 502);
    }

    await admin
      .from("employer_prospects")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", prospectId);

    return json({ sent: true });
  } catch (error: any) {
    console.error("send-prospect-email failed:", error);
    return json({ error: error.message || "Something went wrong." }, 500);
  }
});
