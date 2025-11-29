import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { messages, userType, action } = await req.json();
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const ABACUS_AI_API_KEY = Deno.env.get('ABACUS_AI_API_KEY');
    if (!ABACUS_AI_API_KEY) throw new Error('AI API key not configured');

    // Pre-load existing profile data for candidates
    let existingProfileContext = '';
    if (userType === 'candidate') {
      const { data: candidateProfile } = await supabaseClient
        .from('candidate_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (candidateProfile) {
        existingProfileContext = `
EXISTING PROFILE DATA (pre-loaded from signup):
- Job Title: ${candidateProfile.job_title || 'Not set'}
- Years Experience: ${candidateProfile.years_experience || 0}
- Location: ${candidateProfile.location?.join(', ') || 'Not set'}
- Salary Range: £${candidateProfile.min_salary || 0} - £${candidateProfile.max_salary || 0}
- Skills: ${candidateProfile.required_skills?.join(', ') || 'None listed'}
- Personality Traits: ${candidateProfile.personality ? JSON.stringify(candidateProfile.personality).substring(0, 200) : 'None listed'}
- Current Employer: ${candidateProfile.current_employer || 'Not specified'}
- Work Preferences: ${candidateProfile.preferred_work_type || 'Not set'}

DO NOT ask about the above information again - it's already known. Instead, focus on discovering their life outside work, hobbies, and soft skills.`;
      }
    }

    // Enhanced system prompts for whole-person discovery
    const candidatePrompt = `You are Webby, a friendly AI co-pilot helping people discover career opportunities they might not have considered.

${existingProfileContext}

Your mission is to discover the WHOLE PERSON, not just their job title. Have a SHORT, warm conversation (5-7 questions max) to understand:

1. **Life Outside Work**: What do they do when they're not working? Hobbies, passions, volunteer work, side projects?
   - Ask specifically: "What fills your time outside of work? Any hobbies you're passionate about?"

2. **Hidden Skills**: Activities that might translate to job opportunities
   - Examples: "You swim 4x/week? That's dedication! Ever thought about coaching?" or "You organize community events? That's project management!"

3. **Soft Skills**: How do they describe themselves? Patient? Creative problem-solver? Good with people?
   - Ask: "How would your friends describe you? What are you naturally good at?"

4. **What They Want to Avoid**: Red flags, deal-breakers in jobs
   - Ask: "Any types of work or environments you want to avoid?"

**IMPORTANT MATCHING PHILOSOPHY:**
- Look for TRANSFERABLE skills from hobbies → jobs (e.g., swimming coach → teaching/coaching roles)
- Consider personality fit, not just technical skills
- Think outside the box: a developer who loves public speaking might be great in technical sales
- Focus on "who they are" not just "what they've done"

Keep questions conversational and ONE at a time. After gathering rich data about their hobbies, soft skills, and hidden interests, use the save_candidate_profile tool to structure everything.`;

    const employerPrompt = `You are Webby, a friendly AI assistant helping SMEs (small and medium businesses) find candidates beyond traditional keyword matching.

Your job is to have a SHORT, natural conversation to understand:
1. What kind of role and level (e.g., junior developer, office admin, senior stylist, warehouse operative)
2. Full-time, part-time, or casual/freelance?
3. On-site, hybrid, or remote? Main location?
4. Pay range (hourly or annual)
5. Must-have skills or tools (be specific to their industry)
6. **Soft qualities that matter** (e.g., patient, creative problem solver, team player, handles pressure)
7. **Hidden skills welcome** (e.g., "We'd love someone with coaching experience" or "Public speaking would be a bonus")

**ASK SPECIFICALLY**: "Are there any skills from hobbies or interests that would be valuable? Like coaching, teaching, organizing events, creative pursuits?"

Ask ONE question at a time. Be friendly and efficient.
After gathering enough info, use the create_job_spec tool to structure the data.`;

    const systemPrompt = userType === 'candidate' ? candidatePrompt : employerPrompt;

    // Handle save actions
    if (action === 'save_candidate_profile') {
      const { profileData } = await req.json();
      
      console.log('Saving candidate profile data:', profileData);
      
      // Save to webby_candidate_profiles with new hobby/soft skills data
      const { error: profileError } = await supabaseClient
        .from('webby_candidate_profiles')
        .upsert({
          candidate_id: user.id,
          rough_location: profileData.rough_location,
          hours_per_week_min: profileData.hours_per_week_min,
          hours_per_week_max: profileData.hours_per_week_max,
          availability_slots: profileData.availability_slots,
          min_hourly_rate: profileData.min_hourly_rate,
          min_annual_salary: profileData.min_annual_salary,
          skills_tags: profileData.skills_tags,
          industry_tags: profileData.industry_tags,
          avoid_tags: profileData.avoid_tags,
          environment_preferences: profileData.environment_preferences,
          location_radius_miles: profileData.location_radius_miles,
          // NEW PHASE 2 FIELDS
          hobbies_activities: profileData.hobbies_activities || [],
          life_outside_work: profileData.life_outside_work,
          hidden_interests: profileData.hidden_interests || [],
          soft_skills_self_assessed: profileData.soft_skills_self_assessed || [],
          transferable_skills_ai: profileData.transferable_skills_ai || {},
          alternative_paths_ai: profileData.alternative_paths_ai || {},
          webby_summary: profileData.webby_summary,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error saving webby profile:', profileError);
        throw profileError;
      }

      // Mark onboarding as complete
      const { error: prefError } = await supabaseClient
        .from('webby_preferences')
        .upsert({
          user_id: user.id,
          user_type: 'candidate',
          webby_enabled: true,
          onboarding_completed: true
        });

      if (prefError) {
        console.error('Error updating preferences:', prefError);
        throw prefError;
      }

      console.log('Successfully saved candidate profile and updated preferences');

      return new Response(
        JSON.stringify({ success: true, message: 'Profile saved successfully!' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'save_job_spec') {
      const { jobId, specData } = await req.json();
      
      console.log('Saving job spec data:', specData);
      
      // Save to webby_job_specs with new soft skills fields
      const { error } = await supabaseClient
        .from('webby_job_specs')
        .upsert({
          job_id: jobId,
          employment_type: specData.employment_type,
          remote_hybrid_flags: specData.remote_hybrid_flags,
          industry_type: specData.industry_type,
          seniority_level: specData.seniority_level,
          required_skills: specData.required_skills,
          nice_to_have_skills: specData.nice_to_have_skills,
          business_context: specData.business_context,
          soft_requirements: specData.soft_requirements,
          // NEW PHASE 2 FIELDS
          soft_qualities_needed: specData.soft_qualities_needed || [],
          personality_fit: specData.personality_fit || {},
          hidden_skills_welcome: specData.hidden_skills_welcome || [],
          webby_summary: specData.webby_summary
        });

      if (error) {
        console.error('Error saving job spec:', error);
        throw error;
      }

      console.log('Successfully saved job spec');

      return new Response(
        JSON.stringify({ success: true, message: 'Job spec saved successfully!' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Regular conversation with AI
    console.log('Starting AI conversation with', messages.length, 'messages');
    
    const response = await fetch('https://api.abacus.ai/v0/chatLLM', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ABACUS_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        model: 'gpt-4o-mini',
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || data.response || 'I encountered an error. Could you try again?';
    
    console.log('AI response received, length:', aiMessage.length);
    
    // Check if significant profile data was discussed to trigger match refresh
    let shouldRefreshMatches = false;
    
    if (userType === 'candidate') {
      const candidateKeywords = ['hobby', 'hobbies', 'passion', 'soft skill', 'interest', 'outside work', 'free time', 'volunteer', 'coaching', 'teaching'];
      shouldRefreshMatches = candidateKeywords.some(keyword => 
        aiMessage.toLowerCase().includes(keyword) || 
        messages.some(msg => msg.content.toLowerCase().includes(keyword))
      );
    } else if (userType === 'employer') {
      const employerKeywords = ['soft', 'personality', 'culture', 'hobby', 'activity', 'hidden skill', 'coaching', 'teaching', 'leadership', 'team player'];
      shouldRefreshMatches = employerKeywords.some(keyword => 
        aiMessage.toLowerCase().includes(keyword) || 
        messages.some(msg => msg.content.toLowerCase().includes(keyword))
      );
    }
    
    return new Response(
      JSON.stringify({ 
        message: aiMessage,
        shouldRefreshMatches
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in webby-conversation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
