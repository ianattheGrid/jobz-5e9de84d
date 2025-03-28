
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { event_type, candidate_email, job_title, vr_id, recommendation_id } = await req.json()

    if (!event_type || !candidate_email || !vr_id) {
      throw new Error('Missing required parameters')
    }

    // Get notification message based on event type
    let title = ''
    let message = ''

    switch (event_type) {
      case 'job_match':
        title = 'Candidate Job Match'
        message = `Your candidate (${candidate_email}) has matched with a job`
        break
      case 'interview_request':
        title = 'Interview Requested'
        message = `Your candidate (${candidate_email}) has been invited to interview for a position`
        break
      case 'application_rejected':
        title = 'Application Rejected'
        message = `Your candidate (${candidate_email}) was not selected for a position`
        break
      case 'job_offer':
        title = 'Job Offer Extended'
        message = `Your candidate (${candidate_email}) has received a job offer`
        break
      case 'job_started':
        title = 'Candidate Started Job'
        message = `Your candidate (${candidate_email}) has started their new position`
        break
      default:
        title = 'Candidate Update'
        message = `Update regarding your candidate (${candidate_email})`
    }

    // Add job title if provided (without revealing employer)
    if (job_title) {
      message += ` as a ${job_title}`
    }

    // Insert notification
    const { data, error } = await supabase
      .from('push_notifications')
      .insert({
        user_id: vr_id,
        type: 'vr_candidate_update',
        title: title,
        message: message,
        related_entity_id: recommendation_id ? recommendation_id.toString() : null
      })

    if (error) throw error

    // Also record this status change in the candidate_recommendations table if ID provided
    if (recommendation_id) {
      let new_status = 'pending'
      
      switch (event_type) {
        case 'job_match':
          new_status = 'matched'
          break
        case 'interview_request':
          new_status = 'interviewing'
          break
        case 'application_rejected':
          new_status = 'rejected'
          break
        case 'job_offer':
          new_status = 'offered'
          break
        case 'job_started':
          new_status = 'hired'
          break
      }
      
      await supabase
        .from('candidate_recommendations')
        .update({ status: new_status })
        .eq('id', recommendation_id)
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending VR notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
