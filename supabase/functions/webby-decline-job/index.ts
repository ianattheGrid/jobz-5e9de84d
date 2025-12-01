import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { job_id, reason } = await req.json();

    console.log('Processing job decline:', { user_id: user.id, job_id, reason });

    // If "never show again", update candidate's avoid lists
    if (reason === 'never_show_again') {
      // Get job spec to extract tags
      const { data: jobSpec } = await supabaseClient
        .from('webby_job_specs')
        .select('sector_tags, function_tags')
        .eq('job_id', job_id)
        .single();

      if (jobSpec) {
        // Get current candidate profile
        const { data: candidateProfile } = await supabaseClient
          .from('webby_candidate_profiles')
          .select('sectors_to_avoid, functions_to_avoid')
          .eq('candidate_id', user.id)
          .single();

        const currentSectorsToAvoid = candidateProfile?.sectors_to_avoid || [];
        const currentFunctionsToAvoid = candidateProfile?.functions_to_avoid || [];

        // Add new tags to avoid lists (deduplicate)
        const newSectorsToAvoid = Array.from(new Set([
          ...currentSectorsToAvoid,
          ...(jobSpec.sector_tags || [])
        ]));

        const newFunctionsToAvoid = Array.from(new Set([
          ...currentFunctionsToAvoid,
          ...(jobSpec.function_tags || [])
        ]));

        // Update candidate profile with new avoid lists
        const { error: updateError } = await supabaseClient
          .from('webby_candidate_profiles')
          .upsert({
            candidate_id: user.id,
            sectors_to_avoid: newSectorsToAvoid,
            functions_to_avoid: newFunctionsToAvoid,
            updated_at: new Date().toISOString()
          });

        if (updateError) {
          console.error('Error updating avoid lists:', updateError);
          throw updateError;
        }

        console.log('Updated avoid lists:', {
          sectors: newSectorsToAvoid,
          functions: newFunctionsToAvoid
        });
      }
    }

    // Log the decline reason for analytics
    // You could create a job_declines table here if you want to track this

    return new Response(
      JSON.stringify({ 
        success: true,
        message: reason === 'never_show_again' 
          ? "I've added this type of role to your avoid list"
          : "Thanks for the feedback"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in webby-decline-job:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
