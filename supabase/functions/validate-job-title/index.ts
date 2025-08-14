import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

interface ValidationRequest {
  jobTitle: string;
  workArea: string;
  suggestionId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobTitle, workArea, suggestionId }: ValidationRequest = await req.json();

    console.log('Validating job title:', { jobTitle, workArea, suggestionId });

    // Validate job title using Abacus.ai
    const abacusResponse = await validateWithAbacus(jobTitle, workArea);
    
    // Update the job title suggestion with AI validation results
    const { error: updateError } = await supabase
      .from('job_title_suggestions')
      .update({
        ai_validation_status: abacusResponse.isValid ? 'approved' : 'rejected',
        ai_validation_score: abacusResponse.score,
        ai_validation_reason: abacusResponse.reason
      })
      .eq('id', suggestionId);

    if (updateError) {
      console.error('Error updating job title suggestion:', updateError);
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
    console.error('Error validating job title:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to validate job title',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function validateWithAbacus(jobTitle: string, workArea: string) {
  const apiKey = Deno.env.get('ABACUS_AI_API_KEY');
  
  if (!apiKey) {
    throw new Error('ABACUS_AI_API_KEY not configured');
  }

  // Create validation prompt
  const prompt = `Analyze if "${jobTitle}" is a valid, professional job title for the ${workArea} work area.

Consider:
1. Is this a legitimate professional job title?
2. Is it relevant to the specified work area?
3. Is it appropriate for professional use (no offensive content)?
4. Is it specific enough to be useful for job postings?
5. Does it follow standard job title conventions?

Rate from 0-100 where:
- 90-100: Highly relevant, professional job title
- 70-89: Good job title, mostly relevant
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
      return basicValidation(jobTitle, workArea);
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
    return basicValidation(jobTitle, workArea);
  }
}

function basicValidation(jobTitle: string, workArea: string) {
  // Basic validation rules as fallback
  const title = jobTitle.toLowerCase().trim();
  
  // Check for inappropriate content
  const inappropriateTerms = ['fake', 'scam', 'illegal', 'xxx', 'porn'];
  const hasInappropriate = inappropriateTerms.some(term => title.includes(term));
  
  if (hasInappropriate) {
    return {
      isValid: false,
      score: 0,
      reason: 'Contains inappropriate content'
    };
  }
  
  // Check minimum length
  if (title.length < 2) {
    return {
      isValid: false,
      score: 10,
      reason: 'Job title too short'
    };
  }
  
  // Check if it's just numbers or special characters
  if (!/[a-zA-Z]/.test(title)) {
    return {
      isValid: false,
      score: 15,
      reason: 'Must contain letters'
    };
  }
  
  // Basic relevance check for common work areas
  const workAreaKeywords: Record<string, string[]> = {
    'IT': ['developer', 'engineer', 'programmer', 'analyst', 'architect', 'administrator', 'manager', 'consultant', 'specialist', 'technician'],
    'Finance': ['accountant', 'analyst', 'manager', 'advisor', 'controller', 'auditor', 'clerk', 'officer', 'specialist'],
    'Engineering': ['engineer', 'technician', 'designer', 'manager', 'supervisor', 'coordinator', 'specialist'],
    'Customer Service': ['representative', 'agent', 'specialist', 'manager', 'coordinator', 'supervisor'],
    'Hospitality': ['manager', 'coordinator', 'attendant', 'supervisor', 'specialist', 'host', 'server'],
    'Public Sector': ['officer', 'administrator', 'manager', 'coordinator', 'analyst', 'specialist']
  };
  
  const keywords = workAreaKeywords[workArea] || [];
  const hasRelevantKeyword = keywords.some(keyword => title.includes(keyword.toLowerCase()));
  
  const score = hasRelevantKeyword ? 75 : 55;
  
  return {
    isValid: score >= 60,
    score: score,
    reason: hasRelevantKeyword ? 'Appears relevant to work area' : 'Relevance unclear, requires admin review'
  };
}