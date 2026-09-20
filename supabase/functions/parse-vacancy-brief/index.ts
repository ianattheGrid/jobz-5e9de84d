import { corsHeaders } from '../_shared/cors.ts';

const WORK_AREAS = [
  "R&D", "Quality Assurance", "Sales", "Marketing", "Customer Service", "IT",
  "Accounting & Finance", "Human Resources", "Legal", "Manufacturing",
  "Energy & Utilities", "Pharma", "Public Sector", "Engineering",
  "Hospitality & Tourism", "Other",
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
      return new Response(JSON.stringify({ error: 'Please describe the role in a sentence or two.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
              `You turn an employer's plain-English description of a vacancy into a draft job posting for a UK job platform (salaries in GBP, UK English spelling).\n` +
              `Never invent facts the employer did not give. If a detail is unknown, leave that field out entirely — do not guess salaries, benefits or holiday.\n` +
              `The description should be a short, honest advert (80-200 words) using only what the employer said.\n` +
              `Valid workArea values: ${WORK_AREAS.join(', ')}.`,
          },
          { role: 'user', content: prompt.slice(0, 4000) },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'draft_vacancy',
              description: 'A draft vacancy built only from what the employer described.',
              parameters: {
                type: 'object',
                properties: {
                  title: { type: 'string', description: 'Job title' },
                  location: { type: 'string', description: 'Town, city or postcode area' },
                  description: { type: 'string', description: 'Short job advert, UK English' },
                  workArea: { type: 'string', enum: WORK_AREAS },
                  itSpecialization: { type: 'string', description: 'Specialisation within the work area, if stated' },
                  min_salary: { type: 'number', description: 'Minimum salary in GBP per year, only if stated' },
                  max_salary: { type: 'number', description: 'Maximum salary in GBP per year, only if stated' },
                  minYearsExperience: { type: 'number' },
                  holidayEntitlement: { type: 'string', description: 'Holiday days per year, only if stated' },
                  companyBenefits: { type: 'string', description: 'Benefits, only if stated' },
                  workLocation: { type: 'string', enum: ['office', 'hybrid', 'remote'] },
                },
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'draft_vacancy' } },
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'The assistant is busy right now, please try again in a moment.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: 'AI credits exhausted. Please top up to keep using the assistant.' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!response.ok) {
      const detail = await response.text();
      console.error('AI gateway error', response.status, detail);
      return new Response(JSON.stringify({ error: 'Could not draft that vacancy, please try rephrasing.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    let draft: Record<string, unknown> = {};
    if (call?.function?.arguments) {
      try {
        draft = JSON.parse(call.function.arguments);
      } catch (_e) {
        draft = {};
      }
    }

    return new Response(JSON.stringify({ draft }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('parse-vacancy-brief error:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong drafting that vacancy.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
