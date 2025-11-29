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

    // Define system prompts based on user type
    const candidatePrompt = `You are Webby, a friendly AI assistant helping candidates find local work.

Your job is to have a SHORT, natural conversation to understand:
1. Their rough location/area (just the area/postcode, not full address)
2. How many hours per week they want to work
3. When they're usually free (weekdays, evenings, weekends, nights)
4. Their minimum acceptable pay (hourly or annual salary)
5. Their skills and experience (any industry - hospitality, tech, trades, admin, etc.)
6. Types of work or environments they want to AVOID (e.g., "no night shifts", "no telesales")

Be conversational, warm, and ask ONE question at a time. Keep it human.
After gathering enough info, use the save_candidate_profile tool to structure the data.`;

    const employerPrompt = `You are Webby, a friendly AI assistant helping SMEs (small and medium businesses) hire.

Your job is to have a SHORT, natural conversation to understand:
1. What kind of role and level (e.g., junior developer, office admin, senior stylist, warehouse operative)
2. Full-time, part-time, or casual/freelance?
3. On-site, hybrid, or remote? Main location?
4. Pay range (hourly or annual)
5. Must-have skills or tools (be specific to their industry)
6. Soft qualities that matter (e.g., reliable, client-facing, handles pressure, attention to detail)

Ask ONE question at a time. Be friendly and efficient.
After gathering enough info, use the create_job_spec tool to structure the data.`;

    const systemPrompt = userType === 'candidate' ? candidatePrompt : employerPrompt;

    // Handle save actions
    if (action === 'save_candidate_profile') {
      const { profileData } = await req.json();
      
      // Save to webby_candidate_profiles
      const { error } = await supabaseClient
        .from('webby_candidate_profiles')
        .upsert({
          candidate_id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Mark onboarding as complete
      await supabaseClient
        .from('webby_preferences')
        .upsert({
          user_id: user.id,
          user_type: 'candidate',
          webby_enabled: true,
          onboarding_completed: true
        });

      return new Response(
        JSON.stringify({ success: true, message: 'Profile saved successfully!' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'save_job_spec') {
      const { jobId, specData } = await req.json();
      
      // Save to webby_job_specs
      const { error } = await supabaseClient
        .from('webby_job_specs')
        .upsert({
          job_id: jobId,
          ...specData
        });

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, message: 'Job spec saved successfully!' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Regular conversation
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
    
    return new Response(
      JSON.stringify({ 
        message: data.choices?.[0]?.message?.content || data.response || 'I encountered an error. Could you try again?' 
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
