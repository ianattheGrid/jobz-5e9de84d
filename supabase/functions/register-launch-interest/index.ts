import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { registrationSchema } from "./schema.ts";

Deno.serve(async (req) => {
  const respond = (body: object, status = 200) => new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return respond({ error: "Method not allowed" }, 405);
  try {
    if (Number(req.headers.get("content-length") || 0) > 4096) return respond({ error: "Request too large" }, 413);
    const raw = await req.text();
    if (raw.length > 4096) return respond({ error: "Request too large" }, 413);
    const parsed = registrationSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return respond({ error: "Enter a valid email and agree to receive the launch email." }, 400);
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return respond({ error: "Registration is unavailable. Please try again later." }, 503);
    const client = createClient(url, key);
    const { error } = await client.from("launch_interest_registrations").upsert({
      app_name: "Jobz", name: parsed.data.name || null, email: parsed.data.email,
      launch_email_consent: true,
    }, { onConflict: "app_name,email", ignoreDuplicates: true });
    // Both an inserted registration and an existing saved registration return the same response.
    if (error) return respond({ error: "We couldn't save your interest. Please try again." }, 500);
    return respond({ saved: true });
  } catch {
    return respond({ error: "Please check your details and try again." }, 400);
  }
});