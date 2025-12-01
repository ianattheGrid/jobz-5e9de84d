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

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Fetching matches for user:', user.id);

    // Get candidate's profile data
    const { data: candidateProfile, error: profileError } = await supabaseClient
      .from('candidate_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !candidateProfile) {
      throw new Error('Candidate profile not found');
    }

    // Get webby candidate profile (hobbies, soft skills, etc.)
    const { data: webbyProfile, error: webbyError } = await supabaseClient
      .from('webby_candidate_profiles')
      .select('*')
      .eq('candidate_id', user.id)
      .single();

    console.log('Candidate profile loaded:', {
      jobTitle: candidateProfile.job_title,
      hasWebbyProfile: !!webbyProfile
    });

    // Get all active jobs
    const { data: jobs, error: jobsError } = await supabaseClient
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (jobsError) throw jobsError;

    console.log('Found jobs:', jobs?.length || 0);

    // Use AI to categorize and score matches
    const ABACUS_API_KEY = Deno.env.get('ABACUS_AI_API_KEY');
    if (!ABACUS_API_KEY) {
      throw new Error('ABACUS_AI_API_KEY not configured');
    }

    // Get job specs to access tags
    const { data: jobSpecs } = await supabaseClient
      .from('webby_job_specs')
      .select('job_id, sector_tags, function_tags, environment_tags')
      .in('job_id', jobs?.map(j => j.id) || []);

    // Filter jobs based on avoid lists BEFORE sending to AI
    const sectorsToAvoid = webbyProfile?.sectors_to_avoid || [];
    const functionsToAvoid = webbyProfile?.functions_to_avoid || [];
    
    const filteredJobs = jobs?.filter(job => {
      const jobSpec = jobSpecs?.find(spec => spec.job_id === job.id);
      if (!jobSpec) return true; // Include if no tags
      
      // Exclude if any sector or function tags overlap with avoid lists
      const hasForbiddenSector = jobSpec.sector_tags?.some((tag: string) => 
        sectorsToAvoid.includes(tag)
      );
      const hasForbiddenFunction = jobSpec.function_tags?.some((tag: string) => 
        functionsToAvoid.includes(tag)
      );
      
      return !hasForbiddenSector && !hasForbiddenFunction;
    }) || [];

    console.log(`Filtered ${jobs?.length || 0} jobs to ${filteredJobs.length} after avoid lists`);

    const prompt = `You are Webby, an AI career matchmaker. Analyze these jobs and categorize them for the candidate using their NEXT CHAPTER goals.

**CRITICAL MATCHING RULES:**
1. Never match based on free-text keywords alone - use structured tags and Next Chapter data
2. Prioritize jobs that align with moving_towards_sectors and moving_towards_functions
3. Consider hobby_work_preferences - only match hobby-related jobs if candidate explicitly wants work in that area
4. Always explain WHY you're showing each job

Candidate Profile:
- Current Job Title: ${candidateProfile.job_title}
- Experience: ${candidateProfile.years_experience} years
- Skills: ${candidateProfile.required_skills?.join(', ') || 'Not specified'}
- Location: ${candidateProfile.location?.join(', ') || 'Not specified'}
- Salary Range: £${candidateProfile.min_salary} - £${candidateProfile.max_salary}
${webbyProfile?.next_chapter_summary ? `\n**NEXT CHAPTER (What they want next):**\n"${webbyProfile.next_chapter_summary}"` : ''}
${webbyProfile?.moving_towards_sectors?.length ? `- Moving towards sectors: ${webbyProfile.moving_towards_sectors.join(', ')}` : ''}
${webbyProfile?.moving_towards_functions?.length ? `- Moving towards functions: ${webbyProfile.moving_towards_functions.join(', ')}` : ''}
${webbyProfile?.next_chapter_environment?.length ? `- Next chapter environment: ${webbyProfile.next_chapter_environment.join(', ')}` : ''}
${webbyProfile?.hobbies_activities ? `- Hobbies: ${JSON.stringify(webbyProfile.hobbies_activities)}` : ''}
${webbyProfile?.hobby_work_preferences ? `- Hobby work preferences: ${JSON.stringify(webbyProfile.hobby_work_preferences)}` : ''}
${webbyProfile?.soft_skills_self_assessed?.length ? `- Soft Skills: ${webbyProfile.soft_skills_self_assessed.join(', ')}` : ''}
${webbyProfile?.life_outside_work ? `- Life Outside Work: ${webbyProfile.life_outside_work}` : ''}

Jobs to Analyze (already filtered by avoid lists):
${JSON.stringify(filteredJobs.slice(0, 20).map(job => {
  const spec = jobSpecs?.find(s => s.job_id === job.id);
  return {
    ...job,
    sector_tags: spec?.sector_tags || [],
    function_tags: spec?.function_tags || [],
    environment_tags: spec?.environment_tags || []
  };
}), null, 2)}

Categorize each job into ONE of these categories:
1. PRIMARY: Strong match based on NEXT CHAPTER goals (moving_towards_* fields) - explain how it's a step towards what they want
2. SERENDIPITOUS: Unexpected match based on hobbies they want work in, or hidden interests
3. UNEXPECTED: Alternative career path based on transferable skills from current role

For each match, provide:
- match_score (0-100)
- match_reason: Start with "I'm showing you this because:" then explain using Next Chapter context (e.g., "you said you'd like to move into admin/office work", "it's within your travel radius", "the pay meets your minimum")
- category (primary/serendipitous/unexpected)

Return ONLY valid JSON in this format:
{
  "primary": [{"id": 1, "match_score": 85, "match_reason": "I'm showing you this because: you said you'd like to move into admin/office work, it's within your travel radius, and the pay meets your minimum."}],
  "serendipitous": [{"id": 2, "match_score": 72, "match_reason": "..."}],
  "unexpected": [{"id": 3, "match_score": 68, "match_reason": "..."}]
}

Only include jobs with match_score >= 60. Limit to top 5 per category.`;

    const aiResponse = await fetch('https://api.abacus.ai/api/v0/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ABACUS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error('Failed to get AI response');
    }

    const aiData = await aiResponse.json();
    const aiMessage = aiData.choices?.[0]?.message?.content || '{}';
    
    console.log('AI Response:', aiMessage);

    // Parse AI response
    let categorizedMatches;
    try {
      categorizedMatches = JSON.parse(aiMessage);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      // Fallback to simple matching
      categorizedMatches = {
        primary: jobs?.slice(0, 5).map(job => ({
          id: job.id,
          match_score: 75,
          match_reason: `Matches your ${candidateProfile.job_title} experience`
        })) || [],
        serendipitous: [],
        unexpected: []
      };
    }

    // Enrich matches with full job data
    const enrichMatch = (match: any) => {
      const job = jobs?.find(j => j.id === match.id);
      if (!job) return null;
      return {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        type: job.type,
        match_reason: match.match_reason,
        match_score: match.match_score
      };
    };

    const enrichedMatches = {
      primary: categorizedMatches.primary?.map(enrichMatch).filter(Boolean) || [],
      serendipitous: categorizedMatches.serendipitous?.map(enrichMatch).filter(Boolean) || [],
      unexpected: categorizedMatches.unexpected?.map(enrichMatch).filter(Boolean) || []
    };

    console.log('Returning matches:', {
      primary: enrichedMatches.primary.length,
      serendipitous: enrichedMatches.serendipitous.length,
      unexpected: enrichedMatches.unexpected.length
    });

    return new Response(JSON.stringify(enrichedMatches), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in webby-match:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});