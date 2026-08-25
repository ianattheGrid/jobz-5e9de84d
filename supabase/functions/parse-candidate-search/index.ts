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

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
      return new Response(JSON.stringify({ error: 'Please describe the candidate you are looking for.' }), {
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
              `You convert a recruiter's plain-English description of a candidate into structured search filters for a UK job platform (salaries in GBP).\n` +
              `Only fill in fields the recruiter actually implied. Leave everything else out.\n` +
              `Valid workArea values: ${WORK_AREAS.join(', ')}.`,
          },
          { role: 'user', content: prompt },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'set_search_filters',
              description: 'Structured candidate search filters derived from the description.',
              parameters: {
                type: 'object',
                properties: {
                  jobTitle: { type: 'string', description: 'Target job title, e.g. "Frontend Developer"' },
                  workArea: { type: 'string', enum: WORK_AREAS },
                  itSpecialization: { type: 'string', description: 'Specialisation within the work area, if stated' },
                  minSalary: { type: 'number', description: 'Minimum salary in GBP per year' },
                  maxSalary: { type: 'number', description: 'Maximum salary in GBP per year' },
                  minYearsExperience: { type: 'number' },
                  skills: { type: 'array', items: { type: 'string' } },
                  location: { type: 'string', description: 'Town, city or postcode area' },
                  workPreference: { type: 'string', description: 'e.g. remote, hybrid, on-site' },
                  securityClearance: { type: 'string' },
                  qualification: { type: 'string' },
                  commissionOnly: { type: 'boolean', description: 'Only candidates offering a "You are Hired" bonus' },
                },
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'set_search_filters' } },
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'Too many searches right now, please try again in a moment.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: 'AI credits exhausted. Please top up to keep using smart search.' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!response.ok) {
      const detail = await response.text();
      console.error('AI gateway error', response.status, detail);
      return new Response(JSON.stringify({ error: 'Could not understand that search, please try rephrasing.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    let criteria: Record<string, unknown> = {};
    if (call?.function?.arguments) {
      try {
        criteria = JSON.parse(call.function.arguments);
      } catch (_e) {
        criteria = {};
      }
    }

    return new Response(JSON.stringify({ criteria }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('parse-candidate-search error:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong parsing that search.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
