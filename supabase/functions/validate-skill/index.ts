import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

interface ValidationRequest {
  skillName: string;
  workArea: string;
  specialization?: string;
  suggestionId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { skillName, workArea, specialization, suggestionId }: ValidationRequest = await req.json();

    console.log('Validating skill:', { skillName, workArea, specialization, suggestionId });

    // Validate skill using Abacus.ai
    const abacusResponse = await validateWithAbacus(skillName, workArea, specialization);
    
    // Update the skill suggestion with AI validation results
    const { error: updateError } = await supabase
      .from('skill_suggestions')
      .update({
        ai_validation_status: abacusResponse.isValid ? 'approved' : 'rejected',
        ai_validation_score: abacusResponse.score,
        ai_validation_reason: abacusResponse.reason
      })
      .eq('id', suggestionId);

    if (updateError) {
      console.error('Error updating skill suggestion:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        validation: abacusResponse
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error validating skill:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to validate skill',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function validateWithAbacus(skillName: string, workArea: string, specialization?: string) {
  const apiKey = Deno.env.get('ABACUS_AI_API_KEY');
  
  if (!apiKey) {
    throw new Error('ABACUS_AI_API_KEY not configured');
  }

  // Create validation prompt
  const prompt = `Analyze if "${skillName}" is a valid, professional skill for the ${workArea} work area${specialization ? ` with specialization in ${specialization}` : ''}.

Consider:
1. Is this a legitimate professional skill?
2. Is it relevant to the specified work area?
3. Is it appropriate for professional use (no offensive content)?
4. Is it specific enough to be useful?

Rate from 0-100 where:
- 90-100: Highly relevant, professional skill
- 70-89: Good skill, mostly relevant
- 50-69: Somewhat relevant but questionable
- 30-49: Poor relevance or quality
- 0-29: Not relevant or inappropriate

Respond with a score and brief reason.`;

  try {
    // Note: This is a placeholder for Abacus.ai API call
    // You'll need to replace this with the actual Abacus.ai endpoint and format
    const response = await fetch('https://api.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-davinci-003', // Replace with appropriate Abacus.ai model
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      console.error('Abacus.ai API error:', response.status, await response.text());
      // Fallback to basic validation
      return basicValidation(skillName, workArea);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';
    
    // Parse AI response to extract score and reason
    const scoreMatch = aiResponse.match(/(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
    
    return {
      isValid: score >= 60,
      score: score,
      reason: aiResponse.trim() || 'AI validation completed'
    };

  } catch (error) {
    console.error('Error calling Abacus.ai:', error);
    // Fallback to basic validation
    return basicValidation(skillName, workArea);
  }
}

function basicValidation(skillName: string, workArea: string) {
  // Basic validation rules as fallback
  const skill = skillName.toLowerCase().trim();
  
  // Check for inappropriate content
  const inappropriateTerms = ['fake', 'scam', 'illegal', 'xxx', 'porn'];
  const hasInappropriate = inappropriateTerms.some(term => skill.includes(term));
  
  if (hasInappropriate) {
    return {
      isValid: false,
      score: 0,
      reason: 'Contains inappropriate content'
    };
  }
  
  // Check minimum length
  if (skill.length < 2) {
    return {
      isValid: false,
      score: 10,
      reason: 'Skill name too short'
    };
  }
  
  // Check if it's just numbers or special characters
  if (!/[a-zA-Z]/.test(skill)) {
    return {
      isValid: false,
      score: 15,
      reason: 'Must contain letters'
    };
  }
  
  // Basic relevance check for common work areas
  const workAreaKeywords: Record<string, string[]> = {
    'IT': ['programming', 'software', 'code', 'development', 'tech', 'computer', 'web', 'database', 'network', 'security', 'cloud', 'ai', 'machine learning'],
    'Finance': ['accounting', 'financial', 'audit', 'tax', 'investment', 'banking', 'analysis', 'budgeting'],
    'Engineering': ['engineering', 'design', 'technical', 'mechanical', 'electrical', 'civil', 'structural'],
    'Customer Service': ['customer', 'service', 'support', 'communication', 'problem solving', 'phone', 'chat'],
    'Hospitality': ['hospitality', 'hotel', 'restaurant', 'service', 'catering', 'tourism', 'guest'],
    'Public Sector': ['government', 'public', 'policy', 'administration', 'compliance', 'regulatory']
  };
  
  const keywords = workAreaKeywords[workArea] || [];
  const hasRelevantKeyword = keywords.some(keyword => skill.includes(keyword.toLowerCase()));
  
  const score = hasRelevantKeyword ? 75 : 55;
  
  return {
    isValid: score >= 60,
    score: score,
    reason: hasRelevantKeyword ? 'Appears relevant to work area' : 'Relevance unclear, requires admin review'
  };
}