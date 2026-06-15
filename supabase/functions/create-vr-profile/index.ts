import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

console.log("Loading VR profile creation function");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Require an authenticated caller.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    const token = authHeader.replace("Bearer ", "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await authClient.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const body = await req.json();
    const { userId, fullName, email } = body ?? {};

    if (!userId || !fullName || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Caller may only create / overwrite their own VR profile.
    if (userId !== userData.user.id) {
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceKey);

    console.log(`Creating VR profile for: ${fullName} (${email})`);

    const { data: vrNumber, error: vrNumberError } = await adminClient
      .rpc("generate_vr_number");

    if (vrNumberError) {
      console.error("Error generating VR number:", vrNumberError);
      throw vrNumberError;
    }

    const { error } = await adminClient
      .from("virtual_recruiter_profiles")
      .insert({
        id: userId,
        full_name: fullName,
        email: email,
        location: "Not specified",
        vr_number: vrNumber,
        bank_account_verified: false,
        is_active: true,
      });

    if (error) {
      console.error("Error creating VR profile:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, vr_number: vrNumber }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in VR profile creation:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
