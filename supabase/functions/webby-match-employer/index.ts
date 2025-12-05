import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map Second Chapter sectors to employer industry sectors
const SECOND_CHAPTER_TO_EMPLOYER_MAP: Record<string, string[]> = {
  'Education & Training': ['Education'],
  'Hospitality (cafés, bars, restaurants, hotels)': ['Hospitality & Food Service', 'Hospitality'],
  'Retail (shops, supermarkets, customer service)': ['Retail'],
  'Travel & Tourism': ['Travel & Tourism'],
  'Engineering & Technical': ['Manufacturing', 'Automotive', 'Aerospace & Defense', 'Engineering'],
  'Construction & Trades': ['Construction'],
  'Warehousing & Logistics': ['Warehousing & Logistics', 'Logistics'],
  'Office/Admin & Organising': ['Professional Services', 'Finance', 'Administration'],
  'Tech / IT': ['Technology', 'IT', 'Software'],
  'Creative & Media': ['Media & Entertainment', 'Creative', 'Marketing'],
  'Care / Support Work': ['Care & Support Services', 'Healthcare', 'Social Care'],
  'Non-profit / Charity': ['Non-Profit', 'Charity'],
  'Public Sector / Government': ['Government & Public Sector', 'Public Sector'],
  'Consulting / Advisory': ['Professional Services', 'Consulting'],
  'Driving & Delivery': ['Transport & Delivery', 'Logistics'],
  'Outdoor / Environment / Landscaping': ['Outdoor & Environmental', 'Agriculture'],
};

// Map PoP sectors to employer industry sectors
const POP_SECTOR_TO_EMPLOYER_MAP: Record<string, string[]> = {
  'hospitality': ['Hospitality & Food Service', 'Hospitality'],
  'retail': ['Retail'],
  'travel_tourism': ['Travel & Tourism'],
  'warehousing': ['Warehousing & Logistics', 'Logistics'],
  'admin_office': ['Professional Services', 'Administration', 'Finance'],
  'tech_it': ['Technology', 'IT', 'Software'],
  'creative_media': ['Media & Entertainment', 'Creative', 'Marketing'],
  'care_support': ['Care & Support Services', 'Healthcare', 'Social Care'],
  'construction': ['Construction'],
  'education': ['Education'],
  'events': ['Events', 'Hospitality & Food Service'],
  'outdoors': ['Outdoor & Environmental', 'Agriculture'],
};

function checkSectorMatch(candidateSectors: string[], employerSector: string | null, sectorMap: Record<string, string[]>): string[] {
  if (!employerSector || !candidateSectors?.length) return [];
  
  const normalizedEmployerSector = employerSector.toLowerCase();
  return candidateSectors.filter(sector => {
    const mappedSectors = sectorMap[sector] || [];
    return mappedSectors.some(mapped => 
      mapped.toLowerCase().includes(normalizedEmployerSector) || 
      normalizedEmployerSector.includes(mapped.toLowerCase())
    );
  });
}

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

    // Get employer's career-switcher preferences and industry
    const { data: employerProfile } = await supabase
      .from('employer_profiles')
      .select('industry_sector, open_to_career_switchers, willing_to_train_on_the_job, values_soft_skills_over_experience')
      .eq('id', user.id)
      .single();

    console.log('Employer preferences:', employerProfile);

    const employerSector = employerProfile?.industry_sector || null;

    // Fetch all candidate profiles with webby profiles, PoP, and Second Chapter
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
          hobbies_activities,
          next_chapter_summary,
          moving_towards_sectors,
          moving_towards_functions,
          next_chapter_environment,
          transferable_skills_ai
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

    const openToCareerSwitchers = employerProfile?.open_to_career_switchers || false;
    const willingToTrain = employerProfile?.willing_to_train_on_the_job || false;
    const valuesSoftSkills = employerProfile?.values_soft_skills_over_experience || false;

    const systemPrompt = `You are a recruitment AI specializing in matching candidates to job opportunities based on both technical skills AND soft skills/life experiences.

${openToCareerSwitchers ? `\n**IMPORTANT**: This employer is OPEN TO CAREER-SWITCHERS. You should:
- Prioritize candidates whose "Second Chapter" or "Next Chapter" goals align with this role, even if their past experience is in another sector
- Highlight transferable strengths from their current/past roles
- Explain how career-switchers bring valuable perspective\n` : ''}

${willingToTrain ? `**IMPORTANT**: This employer is willing to TRAIN ON THE JOB. Consider candidates with:
- Strong learning ability and soft skills
- Relevant transferable skills even if lacking specific technical expertise
- Adjacent industry experience that can be adapted\n` : ''}

**PROOF OF POTENTIAL (Young candidates aged 18-25):**
When a candidate has Proof of Potential data, this shows their potential through life experiences:
- next_chapter_sectors: Industries they want to work in
- work_style_tags: How they like to work (customer_facing, team_player, etc.)
- reliability_tags: Reliability indicators (punctual, flexible_hours, weekend_ok)
- experience_context_tags: Life experience (family_business, volunteered, organised_events)
- hobby_tags: Hobbies that may indicate transferable skills

For young candidates WITH PoP but LIMITED formal experience:
- Weight their potential HIGHER than lack of experience
- Categorise as HIDDEN_GEMS or TRAINABLE based on PoP alignment
- Look for ⭐ SECTOR MATCH indicators - these candidates are especially relevant

**SECOND CHAPTER (Career changers of any age):**
When a candidate has Second Chapter data, they're looking for a different direction:
- second_chapter_sectors: Industries they want to move into
- sector_transition_type: "stay_same_sector_new_role" | "new_sector" | "either"
- second_chapter_role_shape_tags: What kind of role they want (no_management, hands_on, advisory)
- second_chapter_team_contribution_tags: How they want to contribute
- second_chapter_environment_tags: Environment preferences
- second_chapter_summary: Their own words about their next chapter

For career changers:
${openToCareerSwitchers ? '- PRIORITISE candidates whose second_chapter_sectors match this employer\'s industry' : '- Note Second Chapter data but focus on current skills match'}
- Highlight transferable experience from their current/past roles
- Explain how their experience transfers to this new direction
- Look for ⭐ SECTOR MATCH indicators - these career changers WANT to be in YOUR industry

Your task is to categorize candidates into three types:

1. PRIMARY: Candidates who match the core technical skills and job title requirements
2. HIDDEN_GEMS: 
   - Candidates whose hobbies, activities, or life experiences suggest valuable transferable skills
   - Candidates with Proof of Potential showing sector interest alignment
   ${openToCareerSwitchers ? '- **Career changers (Second Chapter) whose target sectors match this role - PRIORITISE THESE**' : ''}
3. TRAINABLE: Candidates who may lack some technical skills but have the right personality traits, soft skills, and learning potential
   ${willingToTrain ? '(Employer is willing to train, so be generous here)' : ''}

For each candidate, return:
- category: "PRIMARY" | "HIDDEN_GEMS" | "TRAINABLE"
- match_score: 0-100 (how well they fit)
- match_reason: A brief, human explanation of why they match
  - For PoP candidates with sector match: "This young candidate wants to work in [sector] - exactly your industry! They show [relevant traits]..."
  - For Second Chapter with sector match: "This candidate is making a career change INTO [sector] from [previous]. Their transferable skills include..."
  - Mention specific hobbies/activities/Second Chapter goals if relevant

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
- Employer Industry: ${employerSector || 'Not specified'}

Candidates to evaluate:
${candidates.map(c => {
  const webbyProfile = Array.isArray(c.webby_candidate_profiles) 
    ? c.webby_candidate_profiles[0] 
    : c.webby_candidate_profiles;
  
  // Get PoP and Second Chapter data
  const pop = c.proof_of_potential as Record<string, any> | null;
  const showPop = c.show_proof_of_potential !== false;
  const sc = c.second_chapter as Record<string, any> | null;
  const showSc = c.show_second_chapter === true;
  
  // Check sector matches
  const popSectorMatch = pop?.next_chapter_sectors && employerSector
    ? checkSectorMatch(pop.next_chapter_sectors, employerSector, POP_SECTOR_TO_EMPLOYER_MAP)
    : [];
  const scSectorMatch = sc?.second_chapter_sectors && employerSector
    ? checkSectorMatch(sc.second_chapter_sectors, employerSector, SECOND_CHAPTER_TO_EMPLOYER_MAP)
    : [];
  
  return `
Candidate ID: ${c.id}
- Current Job Title: ${c.job_title}
- Skills: ${c.required_skills?.join(', ') || 'None listed'}
- Years Experience: ${c.years_experience || 0}
${webbyProfile?.next_chapter_summary ? `\n**NEXT CHAPTER (from webby profile):**\n"${webbyProfile.next_chapter_summary}"` : ''}
${webbyProfile?.moving_towards_sectors?.length ? `- Moving towards sectors: ${webbyProfile.moving_towards_sectors.join(', ')}` : ''}
${webbyProfile?.moving_towards_functions?.length ? `- Moving towards functions: ${webbyProfile.moving_towards_functions.join(', ')}` : ''}
- Hobbies/Activities: ${webbyProfile?.hobbies_activities ? JSON.stringify(webbyProfile.hobbies_activities) : 'None listed'}
- Soft Skills: ${webbyProfile?.soft_skills_self_assessed?.join(', ') || 'None listed'}
- Environment Preferences: ${webbyProfile?.environment_preferences?.join(', ') || 'None listed'}
- Life Outside Work: ${webbyProfile?.life_outside_work || 'Not specified'}
${webbyProfile?.transferable_skills_ai ? `- Transferable Skills (AI-identified): ${JSON.stringify(webbyProfile.transferable_skills_ai)}` : ''}

${showPop && pop && Object.keys(pop).length > 0 ? `
**PROOF OF POTENTIAL (Young Talent):**
${popSectorMatch.length > 0 ? `⭐ SECTOR MATCH: Wants ${pop.next_chapter_sectors?.join(', ')} - MATCHES employer's industry!` : ''}
- Next Chapter Sectors: ${pop.next_chapter_sectors?.join(', ') || 'Not specified'}
- Work Style: ${pop.work_style_tags?.join(', ') || 'Not specified'}
- Reliability: ${pop.reliability_tags?.join(', ') || 'Not specified'}
- Life Experience: ${pop.experience_context_tags?.join(', ') || 'Not specified'}
${pop.experience_proud_of ? `- Proud of: "${pop.experience_proud_of}"` : ''}
- Hobbies: ${pop.hobby_tags?.join(', ') || 'Not specified'}
` : ''}

${showSc && sc && Object.keys(sc).length > 0 ? `
**SECOND CHAPTER (Career Changer):**
${scSectorMatch.length > 0 ? `⭐ SECTOR MATCH: Wants ${sc.second_chapter_sectors?.join(', ')} - MATCHES employer's industry!` : ''}
- Interested Sectors: ${sc.second_chapter_sectors?.join(', ') || 'Not specified'}
- Transition Type: ${sc.sector_transition_type || 'Not specified'}
- Role Shape: ${sc.second_chapter_role_shape_tags?.join(', ') || 'Not specified'}
- Team Contribution: ${sc.second_chapter_team_contribution_tags?.join(', ') || 'Not specified'}
- Environment: ${sc.second_chapter_environment_tags?.join(', ') || 'Not specified'}
${sc.second_chapter_summary ? `- In Their Words: "${sc.second_chapter_summary}"` : ''}
` : ''}
`;
}).join('\n---\n')}

Categorize and score each candidate. ${openToCareerSwitchers ? 'PRIORITISE candidates with ⭐ SECTOR MATCH - these are career changers actively seeking YOUR industry.' : 'Focus on finding hidden gems - candidates whose life experiences make them valuable even if their resume doesn\'t perfectly match.'}`;

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
