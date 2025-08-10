import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json", ...corsHeaders },
    ...init,
  });
}

async function sendAlert(subject: string, text: string) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const ALERT_EMAIL = Deno.env.get("ALERT_EMAIL");
  if (!RESEND_API_KEY || !ALERT_EMAIL) {
    console.warn("nightly-e2e: missing RESEND_API_KEY or ALERT_EMAIL; skipping email alert");
    return;
  }
  const body = {
    from: "alerts@jobz.test",
    to: [ALERT_EMAIL],
    subject,
    text,
  };
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    console.error("nightly-e2e: failed to send alert", await resp.text());
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ ok: false, error: "Missing Supabase env configuration" }, { status: 500 });
  }
  const admin = createClient(supabaseUrl, serviceRoleKey);

  try {
    console.log("nightly-e2e: invoking full run-e2e-test");
    const { data, error } = await admin.functions.invoke("run-e2e-test", {
      body: { trigger: "cron", mode: "full" },
    });

    if (error || !data?.ok) {
      const errMsg = (data as any)?.error || error?.message || "Unknown error";
      await sendAlert(
        "Nightly E2E FAILED",
        `The nightly E2E test failed. Error: ${errMsg}`
      );
      return jsonResponse({ ok: false, error: errMsg }, { status: 500 });
    }

    console.log("nightly-e2e: success", data);
    return jsonResponse({ ok: true, duration_ms: (data as any)?.duration_ms });
  } catch (e: any) {
    await sendAlert("Nightly E2E FAILED (exception)", String(e?.message || e));
    return jsonResponse({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
});
