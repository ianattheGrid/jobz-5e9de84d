import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Add timeout wrapper for request body parsing
    const requestBody = await Promise.race([
      req.json(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      )
    ]);

    const { path, expiresIn = 3600 } = requestBody;

    if (!path || typeof path !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'path'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !serviceKey || !anonKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Simplified auth verification with timeout
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const userResult = await Promise.race([
      userClient.auth.getUser(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth timeout')), 3000)
      )
    ]);

    const { data: { user }, error: userError } = userResult;
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Security check: ensure path belongs to user
    const firstSegment = path.split("/")[0];
    if (firstSegment !== user.id) {
      return new Response(
        JSON.stringify({ error: "Access denied" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate signed URL with timeout
    const adminClient = createClient(supabaseUrl, serviceKey);
    
    const signedResult = await Promise.race([
      adminClient.storage.from("cvs").createSignedUrl(path, expiresIn),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Signing timeout')), 3000)
      )
    ]);

    const { data: signed, error: signErr } = signedResult;

    if (signErr) {
      return new Response(
        JSON.stringify({ error: "Failed to generate signed URL" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ signedUrl: signed?.signedUrl || null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
