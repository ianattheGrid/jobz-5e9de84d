import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { to_user_id, interest_type, job_id } = await req.json();

    if (!to_user_id || !interest_type) {
      throw new Error("Missing required fields");
    }

    // Get user types
    const { data: fromUserRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    const { data: toUserRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", to_user_id)
      .single();

    const fromUserType = fromUserRole?.role || 'unknown';
    const toUserType = toUserRole?.role || 'unknown';

    // Ensure we have candidate_id and employer_id regardless of who initiated
    let candidateId, employerId;
    if (fromUserType === 'candidate') {
      candidateId = user.id;
      employerId = to_user_id;
    } else {
      candidateId = to_user_id;
      employerId = user.id;
    }

    console.log(`Interest from ${fromUserType} ${user.id} to ${toUserType} ${to_user_id}`);

    // Record interest in webby_interests table
    const { data: interest, error: interestError } = await supabase
      .from("webby_interests")
      .upsert({
        candidate_id: candidateId,
        employer_id: employerId,
        job_id: job_id,
        initiated_by: user.id,
        [`${fromUserType}_interest_status`]: 'interested',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'candidate_id,employer_id',
      })
      .select()
      .single();

    if (interestError) {
      console.error("Error recording interest:", interestError);
      throw interestError;
    }

    // Check if there's mutual interest
    const otherPartyStatus = interest[`${toUserType}_interest_status`];
    const isMutualMatch = otherPartyStatus === 'interested';

    console.log(`Mutual match: ${isMutualMatch}`);

    // If mutual match, create match record
    if (isMutualMatch) {
      const { error: matchError } = await supabase
        .from("webby_matches")
        .insert({
          candidate_id: candidateId,
          employer_id: employerId,
          job_id: job_id,
          status: 'new',
        });

      if (matchError && !matchError.message.includes('duplicate')) {
        console.error("Error creating match:", matchError);
      }
    }

    // Check if target user is online
    const { data: targetPresence } = await supabase
      .from("webby_presence")
      .select("is_online")
      .eq("user_id", to_user_id)
      .single();

    const isOnline = targetPresence?.is_online || false;

    console.log(`Target user ${to_user_id} is online: ${isOnline}`);

    // Send notification based on whether they're online
    if (!isOnline) {
      // Send push notification
      const notificationType = isMutualMatch 
        ? 'match_created' 
        : interest_type === 'interested' ? 'interest_received' : 'profile_viewed';

      const { error: notifError } = await supabase
        .from("push_notifications")
        .insert({
          user_id: to_user_id,
          type: notificationType,
          title: isMutualMatch 
            ? "🎉 It's a Match!" 
            : interest_type === 'interested' 
              ? "Someone's Interested!" 
              : "Profile View",
          message: isMutualMatch
            ? `You and ${fromUserType === 'employer' ? 'a company' : 'a candidate'} are interested in each other!`
            : `A ${fromUserType} is interested in your profile`,
          related_entity_id: interest.id,
        });

      if (notifError) {
        console.error("Error creating notification:", notifError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        is_match: isMutualMatch,
        is_online: isOnline,
        interest_id: interest.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in webby-express-interest:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
