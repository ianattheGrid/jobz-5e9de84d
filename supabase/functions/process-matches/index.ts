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
    console.log('Starting job matching process...')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Call the database function to process matches
    const { error } = await supabaseClient.rpc('http_process_matches')

    if (error) {
      console.error('Error processing matches:', error)
      throw error
    }

    // Get new matches that haven't been notified
    const { data: newMatches, error: matchesError } = await supabaseClient
      .from('job_matches')
      .select(`
        *,
        jobs (
          title,
          company,
          employer_id
        ),
        candidate_profiles (
          email
        )
      `)
      .eq('is_notified', false)
      .gte('match_score', 70) // Only notify for high-quality matches

    if (matchesError) throw matchesError

    // Send notifications for each new match
    for (const match of newMatches || []) {
      try {
        // Get employer email
        const { data: employerData } = await supabaseClient
          .from('employer_profiles')
          .select('email')
          .eq('id', match.jobs.employer_id)
          .single()

        if (employerData) {
          // Send notifications
          const notifyResponse = await fetch(
            `${Deno.env.get('SUPABASE_URL')}/functions/v1/notify-match`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
              },
              body: JSON.stringify({
                candidateEmail: match.candidate_profiles.email,
                employerEmail: employerData.email,
                jobTitle: match.jobs.title,
                matchScore: match.match_score,
                companyName: match.jobs.company
              })
            }
          )

          if (notifyResponse.ok) {
            // Mark match as notified
            await supabaseClient
              .from('job_matches')
              .update({ is_notified: true })
              .eq('id', match.id)
          }
        }
      } catch (error) {
        console.error(`Error processing notification for match ${match.id}:`, error)
        // Continue with other matches even if one fails
      }
    }

    console.log('Job matching process completed successfully')

    return new Response(
      JSON.stringify({ message: 'Matches processed and notifications sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing matches:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})