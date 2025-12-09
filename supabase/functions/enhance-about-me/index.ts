import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'No text provided to enhance' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service is not configured');
    }

    console.log('Enhancing about me text, original length:', text.length);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a professional career coach helping job candidates improve their personal statement for a recruitment platform. 

Your task is to enhance the user's "About Me" text while:
- Keeping their authentic voice and personality
- Making it more professional and engaging
- Highlighting their strengths and unique qualities
- Keeping it concise (under 1000 characters)
- Avoiding clichés and generic phrases
- Making it appealing to potential employers
- Preserving any specific details they mentioned

IMPORTANT: Return ONLY the enhanced text, nothing else. No explanations, no quotation marks, just the improved personal statement.`
          },
          {
            role: 'user',
            content: `Please enhance this personal statement while keeping it authentic and under 1000 characters:\n\n${text}`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(
          JSON.stringify({ error: 'AI service quota exceeded. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI service error');
    }

    const data = await response.json();
    const enhancedText = data.choices?.[0]?.message?.content?.trim();

    if (!enhancedText) {
      console.error('No content in AI response:', data);
      throw new Error('Failed to generate enhanced text');
    }

    // Ensure the enhanced text doesn't exceed 1000 characters
    const finalText = enhancedText.length > 1000 
      ? enhancedText.substring(0, 997) + '...'
      : enhancedText;

    console.log('Enhanced text generated, length:', finalText.length);

    return new Response(
      JSON.stringify({ enhancedText: finalText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in enhance-about-me function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to enhance text' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
