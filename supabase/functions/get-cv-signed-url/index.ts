import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  console.log("Edge function called with method:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log("Request body:", requestBody);
    
    const { path, expiresIn = 3600 } = requestBody;

    if (!path || typeof path !== "string") {
      console.log("Missing or invalid path:", path);
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'path'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    console.log("Environment variables loaded");

    // Get the authenticated user from the incoming JWT
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });
    
    console.log("Getting user from auth token...");
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    
    if (userErr || !userData?.user) {
      console.log("Auth error:", userErr);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("User authenticated:", userData.user.id);

    // Ensure the requested path belongs to the requester (first folder = user id)
    const firstSegment = path.split("/")[0];
    console.log("Path:", path);
    console.log("First segment:", firstSegment);
    console.log("User ID:", userData.user.id);
    console.log("Match:", firstSegment === userData.user.id);
    
    if (firstSegment !== userData.user.id) {
      console.log("Access denied - path doesn't belong to user");
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Creating admin client for signed URL generation...");

    // Use service role to bypass storage RLS securely after validating ownership
    const adminClient = createClient(supabaseUrl, serviceKey);
    
    console.log("Generating signed URL for path:", path);
    const { data: signed, error: signErr } = await adminClient
      .storage
      .from("cvs")
      .createSignedUrl(path, expiresIn);

    if (signErr) {
      console.error("Failed to create signed URL", signErr);
      return new Response(
        JSON.stringify({ error: signErr.message || "Failed to create signed URL" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Successfully generated signed URL");

    return new Response(
      JSON.stringify({ url: signed?.signedUrl || null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error("get-cv-signed-url error", e);
    return new Response(
      JSON.stringify({ error: e?.message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
