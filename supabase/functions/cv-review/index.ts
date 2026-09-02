import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvText, targetRole } = await req.json();

    if (!cvText || typeof cvText !== 'string' || cvText.trim().length < 200) {
      return new Response(
        JSON.stringify({ error: 'Please paste at least a few paragraphs of your CV so we can review it properly.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Guard against very large pastes running up cost.
    const trimmed = cvText.slice(0, 20000);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI service is not configured.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content:
              `You are an experienced UK recruiter reviewing a CV. Be specific, practical and kind — never generic.\n` +
              `Use British English and UK conventions (CV not resume, £ salaries, UK date formats).\n` +
              `Rewrite bullet points in the candidate's own voice: plain, concrete, results-first. Never invent achievements, ` +
              `numbers or employers that are not in the CV — if a bullet needs a metric, phrase it so the candidate can add their own.` +
              (targetRole ? `\nThe candidate is targeting this kind of role: ${targetRole}.` : ''),
          },
          { role: 'user', content: trimmed },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'return_cv_review',
              description: 'Structured review of the candidate CV.',
              parameters: {
                type: 'object',
                properties: {
                  score: { type: 'number', description: 'Overall CV strength out of 100' },
                  headline: { type: 'string', description: 'One-sentence verdict on the CV' },
                  strengths: {
                    type: 'array',
                    items: { type: 'string' },
                    description: '2-4 things this CV already does well',
                  },
                  issues: {
                    type: 'array',
                    description: '3-5 concrete problems, most important first',
                    items: {
                      type: 'object',
                      properties: {
                        problem: { type: 'string' },
                        fix: { type: 'string', description: 'What to do about it' },
                      },
                      required: ['problem', 'fix'],
                    },
                  },
                  rewrittenBullets: {
                    type: 'array',
                    description: '3-5 bullet points taken from the CV and rewritten to be stronger',
                    items: {
                      type: 'object',
                      properties: {
                        before: { type: 'string' },
                        after: { type: 'string' },
                      },
                      required: ['before', 'after'],
                    },
                  },
                  missingKeywords: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Terms an ATS would expect for this kind of role but which are missing',
                  },
                  suggestedTitles: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Job titles this person is a realistic fit for right now',
                  },
                },
                required: ['score', 'headline', 'strengths', 'issues', 'rewrittenBullets'],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'return_cv_review' } },
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Lots of CVs coming through right now — please try again in a moment.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: 'AI credits exhausted. Please top up to keep using the CV review.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    if (!response.ok) {
      const detail = await response.text();
      console.error('AI gateway error', response.status, detail);
      return new Response(JSON.stringify({ error: 'We could not review that CV. Please try again.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    let review: Record<string, unknown> | null = null;
    if (call?.function?.arguments) {
      try {
        review = JSON.parse(call.function.arguments);
      } catch (_e) {
        review = null;
      }
    }

    if (!review) {
      return new Response(JSON.stringify({ error: 'We could not read that CV. Try pasting the text again.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ review }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('cv-review error:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong reviewing that CV.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
