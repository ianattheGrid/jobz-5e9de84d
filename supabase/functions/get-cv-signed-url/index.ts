import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  console.log("=== EDGE FUNCTION START ===");
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    console.log("OPTIONS request - returning CORS headers");
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Processing POST request...");
  
  let requestBody;
  try {
    console.log("Parsing request body...");
    requestBody = await req.json();
    console.log("Request body parsed:", { path: requestBody?.path, clickId: requestBody?.clickId });
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return new Response(
      JSON.stringify({ error: "Invalid JSON in request body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { path, expiresIn = 3600 } = requestBody;

  if (!path || typeof path !== "string") {
    console.error("Invalid path:", path);
    return new Response(
      JSON.stringify({ error: "Missing or invalid 'path'" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  console.log("Path validated:", path);

  try {
    console.log("Getting environment variables...");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !serviceKey || !anonKey) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Environment variables OK");

    // Get auth header
    console.log("Checking auth header...");
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid auth header");
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Auth header OK");

    // Use Supabase client to verify the user and get their ID
    console.log("Creating user client...");
    const userClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    console.log("User client created, getting user...");
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    
    if (userError || !user) {
      console.error("Auth verification failed:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("User verified:", user.id);
    const userId = user.id;

    // Security check: ensure path belongs to user
    console.log("Checking path security...");
    const firstSegment = path.split("/")[0];
    if (firstSegment !== userId) {
      console.error("Access denied - path doesn't belong to user");
      return new Response(
        JSON.stringify({ error: "Access denied" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Security check passed");

    // Create service role client for signed URL generation
    console.log("Creating admin client...");
    const adminClient = createClient(supabaseUrl, serviceKey);
    
    console.log("Generating signed URL...");
    const { data: signed, error: signErr } = await adminClient
      .storage
      .from("cvs")
      .createSignedUrl(path, expiresIn);

    if (signErr) {
      console.error("Signed URL error:", signErr);
      return new Response(
        JSON.stringify({ error: "Failed to generate signed URL" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Signed URL generated successfully");
    console.log("=== EDGE FUNCTION SUCCESS ===");

    return new Response(
      JSON.stringify({ signedUrl: signed?.signedUrl || null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
