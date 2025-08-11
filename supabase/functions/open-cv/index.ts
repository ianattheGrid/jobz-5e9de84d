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
    const path = url.searchParams.get('path');
    
    if (!path) {
      return new Response("Missing path parameter", { status: 400 });
    }

    // Get user ID from JWT token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    let userId;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.sub;
    } catch (e) {
      return new Response("Invalid token", { status: 401 });
    }

    // Security check
    const firstSegment = path.split("/")[0];
    if (firstSegment !== userId) {
      return new Response("Access denied", { status: 403 });
    }

    // Create admin client and get signed URL
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !serviceKey) {
      return new Response("Server configuration error", { status: 500 });
    }

    const adminClient = createClient(supabaseUrl, serviceKey);
    
    const { data: signed, error } = await adminClient
      .storage
      .from("cvs")
      .createSignedUrl(path, 3600);

    if (error || !signed?.signedUrl) {
      console.error("Signed URL error:", error);
      return new Response("Failed to access file", { status: 400 });
    }

    // Redirect directly to the signed URL
    return new Response(null, {
      status: 302,
      headers: {
        "Location": signed.signedUrl,
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response("Internal server error", { status: 500 });
  }
});