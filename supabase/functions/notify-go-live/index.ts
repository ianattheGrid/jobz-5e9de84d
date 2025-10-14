import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('[notify-go-live] Starting notification process...');

    const { go_live_date } = await req.json();

    // Fetch all candidates who signed up during soft launch
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidate_profiles')
      .select('id, email, full_name')
      .lt('signup_date', go_live_date);

    if (candidatesError) {
      console.error('[notify-go-live] Error fetching candidates:', candidatesError);
      throw candidatesError;
    }

    // Fetch all employers who signed up during soft launch
    const { data: employers, error: employersError } = await supabase
      .from('employer_profiles')
      .select('id, full_name, company_name')
      .lt('created_at', go_live_date);

    if (employersError) {
      console.error('[notify-go-live] Error fetching employers:', employersError);
      throw employersError;
    }

    console.log(`[notify-go-live] Found ${candidates?.length || 0} candidates and ${employers?.length || 0} employers`);

    // Create notifications for candidates
    const candidateNotifications = (candidates || []).map(candidate => ({
      user_id: candidate.id,
      type: 'go_live_announcement',
      title: '🎉 localz is now LIVE!',
      message: `Great news! localz has officially launched in Bristol. Your profile is now visible to all employers. Check out your latest job matches!`,
      is_read: false,
    }));

    // Create notifications for employers
    const employerNotifications = (employers || []).map(employer => ({
      user_id: employer.id,
      type: 'go_live_announcement',
      title: '🎉 localz has launched!',
      message: `localz has officially gone live! Your jobs are now visible to all candidates across Bristol. Check your dashboard for new applications and matches.`,
      is_read: false,
    }));

    const allNotifications = [...candidateNotifications, ...employerNotifications];

    if (allNotifications.length > 0) {
      const { error: insertError } = await supabase
        .from('push_notifications')
        .insert(allNotifications);

      if (insertError) {
        console.error('[notify-go-live] Error inserting notifications:', insertError);
        throw insertError;
      }
    }

    const totalNotified = allNotifications.length;
    console.log(`[notify-go-live] Successfully sent ${totalNotified} notifications`);

    return new Response(
      JSON.stringify({
        success: true,
        notified: totalNotified,
        candidates: candidates?.length || 0,
        employers: employers?.length || 0,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[notify-go-live] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
