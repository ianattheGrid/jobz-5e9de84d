
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

console.log("Loading VR profile creation function");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get request data
    const { userId, fullName, email } = await req.json();

    if (!userId || !fullName || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Creating VR profile for: ${fullName} (${email})`);

    // Generate VR number
    const { data: vrNumber, error: vrNumberError } = await supabaseClient
      .rpc("generate_vr_number");

    if (vrNumberError) {
      console.error("Error generating VR number:", vrNumberError);
      throw vrNumberError;
    }

    // Insert the profile with generated VR number
    const { error } = await supabaseClient
      .from("virtual_recruiter_profiles")
      .insert({
        id: userId,
        full_name: fullName,
        email: email,
        location: "Not specified",
        vr_number: vrNumber,
        bank_account_verified: false,
        is_active: true
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
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
