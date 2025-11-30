import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      throw new Error('Unauthorized');
    }

    console.log('Fetching matches for employer:', user.id);

    // Fetch employer's job spec
    const { data: jobSpec, error: jobSpecError } = await supabase
      .from('webby_job_specs')
      .select('*')
      .eq('employer_id', user.id)
      .single();

    if (jobSpecError) {
      console.log('No job spec found for employer');
      return new Response(
        JSON.stringify({ 
          primary: [], 
          hidden_gems: [], 
          trainable: [] 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Job spec found:', jobSpec);

    // Fetch all candidate profiles with webby profiles
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidate_profiles')
      .select(`
        *,
        webby_candidate_profiles (
          rough_location,
          min_hourly_rate,
          min_annual_salary,
          availability_slots,
          hours_per_week_min,
          hours_per_week_max,
          skills_tags,
          soft_skills_self_assessed,
          environment_preferences,
          life_outside_work,
          hobbies_activities
        )
      `);

    if (candidatesError) {
      console.error('Error fetching candidates:', candidatesError);
      throw candidatesError;
    }

    console.log(`Found ${candidates?.length || 0} candidates to match`);

    if (!candidates || candidates.length === 0) {
      return new Response(
        JSON.stringify({ 
          primary: [], 
          hidden_gems: [], 
          trainable: [] 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use AI to categorize and score candidates
    const abacusApiKey = Deno.env.get('ABACUS_AI_API_KEY');
    if (!abacusApiKey) {
      throw new Error('ABACUS_AI_API_KEY not configured');
    }

    const systemPrompt = `You are a recruitment AI specializing in matching candidates to job opportunities based on both technical skills AND soft skills/life experiences.

Your task is to categorize candidates into three types:

1. PRIMARY: Candidates who match the core technical skills and job title requirements
2. HIDDEN_GEMS: Candidates whose hobbies, activities, or life experiences suggest valuable transferable skills (e.g., sports coaching → leadership, teaching → communication, volunteering → empathy)
3. TRAINABLE: Candidates who may lack some technical skills but have the right personality traits, soft skills, and learning potential

For each candidate, return:
- category: "PRIMARY" | "HIDDEN_GEMS" | "TRAINABLE"
- match_score: 0-100 (how well they fit)
- match_reason: A brief, human explanation of why they match (mention specific hobbies/activities if relevant)

Return ONLY valid JSON in this exact format:
{
  "matches": [
    {
      "candidate_id": "uuid",
      "category": "PRIMARY",
      "match_score": 85,
      "match_reason": "Strong technical skills in required areas"
    }
  ]
}`;

    const userPrompt = `Job Specification:
- Role: ${jobSpec.role_title || 'Not specified'}
- Required Skills: ${jobSpec.required_skills?.join(', ') || 'Not specified'}
- Soft Qualities Sought: ${jobSpec.soft_qualities_sought?.join(', ') || 'Not specified'}
- Hidden Skills Valued: ${jobSpec.hidden_skills_valued?.join(', ') || 'Not specified'}
- Company Culture: ${jobSpec.company_culture || 'Not specified'}

Candidates to evaluate:
${candidates.map(c => {
  const webbyProfile = Array.isArray(c.webby_candidate_profiles) 
    ? c.webby_candidate_profiles[0] 
    : c.webby_candidate_profiles;
  
  return `
Candidate ID: ${c.id}
- Job Title: ${c.job_title}
- Skills: ${c.required_skills?.join(', ') || 'None listed'}
- Years Experience: ${c.years_experience || 0}
- Hobbies/Activities: ${webbyProfile?.hobbies_activities ? JSON.stringify(webbyProfile.hobbies_activities) : 'None listed'}
- Soft Skills: ${webbyProfile?.soft_skills_self_assessed?.join(', ') || 'None listed'}
- Environment Preferences: ${webbyProfile?.environment_preferences?.join(', ') || 'None listed'}
- Life Outside Work: ${webbyProfile?.life_outside_work || 'Not specified'}
`;
}).join('\n---\n')}

Categorize and score each candidate. Focus on finding hidden gems - candidates whose life experiences make them valuable even if their resume doesn't perfectly match.`;

    console.log('Calling AI for candidate matching...');

    const aiResponse = await fetch('https://chatllm.abacus.ai/api/v0/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${abacusApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');

    let matches = [];
    try {
      const content = aiData.choices[0].message.content;
      const parsed = JSON.parse(content);
      matches = parsed.matches || [];
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      matches = [];
    }

    console.log(`AI returned ${matches.length} matches`);

    // Filter by score and categorize
    const primary = matches
      .filter((m: any) => m.category === 'PRIMARY' && m.match_score >= 60)
      .sort((a: any, b: any) => b.match_score - a.match_score)
      .slice(0, 5);

    const hiddenGems = matches
      .filter((m: any) => m.category === 'HIDDEN_GEMS' && m.match_score >= 60)
      .sort((a: any, b: any) => b.match_score - a.match_score)
      .slice(0, 5);

    const trainable = matches
      .filter((m: any) => m.category === 'TRAINABLE' && m.match_score >= 60)
      .sort((a: any, b: any) => b.match_score - a.match_score)
      .slice(0, 5);

    // Enrich with full candidate data including webby profile
    const enrichMatches = (matchList: any[]) => {
      return matchList.map(match => {
        const candidate = candidates.find(c => c.id === match.candidate_id);
        if (!candidate) return null;

        const webbyProfile = Array.isArray(candidate.webby_candidate_profiles) 
          ? candidate.webby_candidate_profiles[0] 
          : candidate.webby_candidate_profiles;

        return {
          ...match,
          employer_id: user.id,
          job_id: jobSpec.job_id,
          candidate: {
            id: candidate.id,
            full_name: candidate.full_name,
            job_title: candidate.job_title,
            location: candidate.location,
            years_experience: candidate.years_experience,
            required_skills: candidate.required_skills,
            profile_picture_url: candidate.profile_picture_url,
          },
          webby_profile: webbyProfile || null,
        };
      }).filter(Boolean);
    };

    const result = {
      primary: enrichMatches(primary),
      hidden_gems: enrichMatches(hiddenGems),
      trainable: enrichMatches(trainable),
    };

    console.log('Returning results:', {
      primary: result.primary.length,
      hidden_gems: result.hidden_gems.length,
      trainable: result.trainable.length,
    });

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in webby-match-employer:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
