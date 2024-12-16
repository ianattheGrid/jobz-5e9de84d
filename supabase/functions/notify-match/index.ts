import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailPayload {
  candidateEmail: string
  employerEmail: string
  jobTitle: string
  matchScore: number
  companyName: string
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

    const { candidateEmail, employerEmail, jobTitle, matchScore, companyName }: EmailPayload = await req.json()

    // Send email to candidate
    const candidateEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`
      },
      body: JSON.stringify({
        from: 'Job Matches <notifications@yourdomain.com>',
        to: candidateEmail,
        subject: `New Job Match: ${jobTitle} at ${companyName}`,
        html: `
          <h1>You have a new job match!</h1>
          <p>Great news! You've been matched with a job that aligns with your profile:</p>
          <ul>
            <li>Position: ${jobTitle}</li>
            <li>Company: ${companyName}</li>
            <li>Match Score: ${matchScore}%</li>
          </ul>
          <p>Log in to your account to view more details and apply!</p>
        `
      })
    })

    if (!candidateEmailResponse.ok) {
      console.error('Error sending candidate email:', await candidateEmailResponse.text())
      throw new Error('Failed to send candidate email')
    }

    // Send email to employer
    const employerEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`
      },
      body: JSON.stringify({
        from: 'Job Matches <notifications@yourdomain.com>',
        to: employerEmail,
        subject: `New Candidate Match for ${jobTitle}`,
        html: `
          <h1>You have a new candidate match!</h1>
          <p>A candidate has matched with your job posting:</p>
          <ul>
            <li>Position: ${jobTitle}</li>
            <li>Match Score: ${matchScore}%</li>
          </ul>
          <p>Log in to your account to view the candidate's profile!</p>
        `
      })
    })

    if (!employerEmailResponse.ok) {
      console.error('Error sending employer email:', await employerEmailResponse.text())
      throw new Error('Failed to send employer email')
    }

    return new Response(
      JSON.stringify({ message: 'Notifications sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in notify-match function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})