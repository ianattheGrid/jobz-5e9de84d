import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FREE_WEBMAIL = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "live.co.uk",
  "live.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "msn.com",
  "btinternet.com",
  "sky.com",
  "protonmail.com",
  "proton.me",
  "mail.com",
  "gmx.com",
  "yandex.com",
];

const domainOf = (value: string | null | undefined) => {
  if (!value) return null;
  const cleaned = value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");
  const host = cleaned.split("/")[0].split("@").pop() || "";
  return host || null;
};

const normalise = (value: string | null | undefined) =>
  (value || "")
    .toLowerCase()
    .replace(/\b(ltd|limited|plc|llp|uk|group|holdings|company|co)\b/g, "")
    .replace(/[^a-z0-9]/g, "");

/**
 * Automatic employer verification. Checks the work email against the company
 * website, rejects free webmail, and looks the company up on the Companies
 * House register. Anything it can't confirm is left for an admin to review.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Not signed in" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    const { data: profile } = await admin
      .from("employer_profiles")
      .select("company_name, company_website, company_email, verification_status")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      return new Response(JSON.stringify({ error: "No employer profile" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Never quietly undo an admin decision.
    if (profile.verification_status === "revoked" || profile.verification_status === "verified") {
      return new Response(JSON.stringify({ status: profile.verification_status }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const workEmail = profile.company_email || userData.user.email || "";
    const emailDomain = domainOf(workEmail);
    const siteDomain = domainOf(profile.company_website);

    const reasons: string[] = [];

    if (!emailDomain || FREE_WEBMAIL.includes(emailDomain)) {
      reasons.push("free_webmail");
    }

    const domainsMatch =
      !!emailDomain && !!siteDomain && (emailDomain === siteDomain || emailDomain.endsWith(`.${siteDomain}`) || siteDomain.endsWith(`.${emailDomain}`));

    if (!domainsMatch) reasons.push("email_does_not_match_website");

    // Companies House lookup
    let companiesHouseNumber: string | null = null;
    const chKey = Deno.env.get("COMPANIES_HOUSE_API_KEY");
    if (chKey && profile.company_name) {
      try {
        const res = await fetch(
          `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(
            profile.company_name
          )}&items_per_page=5`,
          { headers: { Authorization: `Basic ${btoa(`${chKey}:`)}` } }
        );
        if (res.ok) {
          const body = await res.json();
          const wanted = normalise(profile.company_name);
          const hit = (body.items || []).find(
            (i: any) => normalise(i.title) === wanted && i.company_status === "active"
          );
          if (hit) companiesHouseNumber = hit.company_number;
        }
      } catch (err) {
        console.error("Companies House lookup failed", err);
      }
    }

    if (!companiesHouseNumber) reasons.push("no_companies_house_match");

    const verified = domainsMatch && !FREE_WEBMAIL.includes(emailDomain || "") && !!companiesHouseNumber;

    await admin
      .from("employer_profiles")
      .update({
        verification_status: verified ? "verified" : "pending_review",
        verified_at: verified ? new Date().toISOString() : null,
        verification_method: verified ? "automatic" : null,
        companies_house_number: companiesHouseNumber,
      })
      .eq("id", userId);

    return new Response(
      JSON.stringify({
        status: verified ? "verified" : "pending_review",
        reasons,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("verify-employer failed", error);
    return new Response(JSON.stringify({ error: "Verification check failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
