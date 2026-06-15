import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path");

    if (!path) {
      return new Response("Missing path parameter", { status: 400, headers: corsHeaders });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }
    const token = authHeader.replace("Bearer ", "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !anonKey || !serviceKey) {
      return new Response("Server configuration error", { status: 500, headers: corsHeaders });
    }

    // Verify the JWT signature via Supabase rather than decoding it client-side.
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await authClient.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }
    const userId = userData.user.id;

    const firstSegment = path.split("/")[0];
    if (firstSegment !== userId) {
      return new Response("Access denied", { status: 403, headers: corsHeaders });
    }

    const adminClient = createClient(supabaseUrl, serviceKey);

    const { data: signed, error } = await adminClient.storage
      .from("cvs")
      .createSignedUrl(path, 3600);

    if (error || !signed?.signedUrl) {
      console.error("Signed URL error:", error);
      return new Response("Failed to access file", { status: 400, headers: corsHeaders });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: signed.signedUrl,
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response("Internal server error", { status: 500, headers: corsHeaders });
  }
});
