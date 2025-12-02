import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create a Supabase client with the user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the user from the auth header
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Deleting account for user:', user.id);

    // Create admin client for deletion
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Delete user data in order (respecting foreign keys)
    console.log('Deleting user data...');

    // Delete user-specific records
    await supabaseAdmin.from('user_roles').delete().eq('user_id', user.id);
    await supabaseAdmin.from('push_notifications').delete().eq('user_id', user.id);
    await supabaseAdmin.from('user_push_subscriptions').delete().eq('user_id', user.id);
    await supabaseAdmin.from('ai_chat_conversations').delete().eq('user_id', user.id);
    
    // Delete profile-specific data
    await supabaseAdmin.from('candidate_gallery').delete().eq('candidate_id', user.id);
    await supabaseAdmin.from('candidate_portfolio').delete().eq('candidate_id', user.id);
    await supabaseAdmin.from('candidate_verifications').delete().eq('candidate_id', user.id);
    await supabaseAdmin.from('webby_anonymous_cards').delete().eq('candidate_id', user.id);
    await supabaseAdmin.from('webby_candidate_profiles').delete().eq('candidate_id', user.id);
    await supabaseAdmin.from('webby_interests').delete().eq('candidate_id', user.id);
    await supabaseAdmin.from('external_job_matches').delete().eq('candidate_id', user.id);
    await supabaseAdmin.from('vr_referrals').delete().eq('candidate_id', user.id);
    
    // Delete applications and related data
    await supabaseAdmin.from('applications').delete().eq('applicant_id', user.id);
    await supabaseAdmin.from('interview_feedback').delete().eq('candidate_id', user.id);
    await supabaseAdmin.from('interview_slots').delete().eq('candidate_id', user.id);
    await supabaseAdmin.from('interviews').delete().eq('candidate_id', user.id);
    
    // Delete company data
    await supabaseAdmin.from('company_gallery').delete().eq('employer_id', user.id);
    
    // Delete job-related data
    const { data: userJobs } = await supabaseAdmin
      .from('jobs')
      .select('id')
      .eq('employer_id', user.id);
    
    if (userJobs && userJobs.length > 0) {
      const jobIds = userJobs.map(j => j.id);
      await supabaseAdmin.from('applications').delete().in('job_id', jobIds);
      await supabaseAdmin.from('interview_slots').delete().in('job_id', jobIds);
      await supabaseAdmin.from('interviews').delete().in('job_id', jobIds);
      await supabaseAdmin.from('webby_interests').delete().in('job_id', jobIds);
      await supabaseAdmin.from('webby_job_specs').delete().in('job_id', jobIds);
      await supabaseAdmin.from('bonus_payments').delete().in('job_id', jobIds);
      await supabaseAdmin.from('commission_negotiations').delete().in('job_id', jobIds);
      await supabaseAdmin.from('jobs').delete().eq('employer_id', user.id);
    }

    // Delete employer data
    await supabaseAdmin.from('employer_searches').delete().eq('employer_id', user.id);
    await supabaseAdmin.from('employer_interview_feedback').delete().eq('employer_id', user.id);
    await supabaseAdmin.from('bonus_payments').delete().eq('employer_id', user.id);
    await supabaseAdmin.from('commission_negotiations').delete().eq('employer_id', user.id);
    await supabaseAdmin.from('webby_interests').delete().eq('employer_id', user.id);
    
    // Delete VR data
    await supabaseAdmin.from('candidate_recommendations').delete().eq('vr_id', user.id);
    await supabaseAdmin.from('vr_candidate_messages').delete().eq('vr_id', user.id);
    await supabaseAdmin.from('vr_referrals').delete().eq('vr_id', user.id);
    
    // Delete profile records
    await supabaseAdmin.from('candidate_profiles').delete().eq('id', user.id);
    await supabaseAdmin.from('employer_profiles').delete().eq('id', user.id);
    await supabaseAdmin.from('virtual_recruiter_profiles').delete().eq('id', user.id);
    await supabaseAdmin.from('recruiter_profiles').delete().eq('id', user.id);

    // Finally, delete the auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      throw deleteError;
    }

    console.log('Account deleted successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Account deleted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in delete-account function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});