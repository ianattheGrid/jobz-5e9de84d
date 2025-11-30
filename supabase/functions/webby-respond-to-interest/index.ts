import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Authenticate user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { job_id, employer_id, action } = await req.json();

    if (!job_id || !employer_id || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Candidate ${user.id} responding with action: ${action}`);

    // Get candidate's first name for sharing
    let candidateFirstName = null;
    if (action === 'share') {
      const { data: profile } = await supabase
        .from('candidate_profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profile?.full_name) {
        candidateFirstName = profile.full_name.split(' ')[0];
      }
    }

    // Determine new status based on action
    let newStatus: string;
    let anonymityState: string;
    
    switch (action) {
      case 'view':
        newStatus = 'candidate_viewed';
        anonymityState = 'semi_anonymous';
        break;
      case 'share':
        newStatus = 'chatting';
        anonymityState = 'first_name_shared';
        break;
      case 'decline':
        newStatus = 'declined';
        anonymityState = 'anonymous';
        break;
      default:
        throw new Error('Invalid action');
    }

    // Update interest record
    const { error: updateError } = await supabase
      .from('webby_interests')
      .update({
        status: newStatus,
        anonymity_state: anonymityState,
        candidate_interest_status: action === 'decline' ? 'declined' : 'interested',
        candidate_viewed_at: new Date().toISOString(),
        candidate_first_name: candidateFirstName,
        declined_by: action === 'decline' ? 'candidate' : null
      })
      .eq('candidate_id', user.id)
      .eq('employer_id', employer_id)
      .eq('job_id', job_id);

    if (updateError) {
      console.error('Error updating interest:', updateError);
      throw updateError;
    }

    // Send notification to employer
    let notificationMessage = '';
    let notificationTitle = '';
    
    if (action === 'view') {
      notificationTitle = 'Candidate Viewed Your Role';
      notificationMessage = 'A candidate has viewed your job posting and is considering it.';
    } else if (action === 'share') {
      notificationTitle = 'Candidate Ready to Chat';
      notificationMessage = `${candidateFirstName} is interested and ready to chat with you!`;
    } else if (action === 'decline') {
      notificationTitle = 'Candidate Not Interested';
      notificationMessage = 'A candidate has declined your role.';
    }

    // Insert notification for employer
    await supabase
      .from('push_notifications')
      .insert({
        user_id: employer_id,
        type: action === 'share' ? 'candidate_chat_ready' : 'candidate_response',
        title: notificationTitle,
        message: notificationMessage,
        related_entity_id: job_id.toString()
      });

    console.log(`Successfully processed ${action} response from candidate ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        status: newStatus,
        message: action === 'share' ? `Chat opened with ${candidateFirstName}` : 'Response sent'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in webby-respond-to-interest:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
