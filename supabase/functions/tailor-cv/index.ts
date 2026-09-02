import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders } from '../_shared/cors.ts';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'You need to be signed in to use this.' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    if (userError || !user) return json({ error: 'You need to be signed in to use this.' }, 401);

    const { jobId, cvText } = await req.json();
    if (!jobId) return json({ error: 'Missing job.' }, 400);

    // Candidate can only ever tailor against their OWN profile (RLS-scoped read).
    const { data: profile, error: profileError } = await supabase
      .from('candidate_profiles')
      .select(
        'id, full_name, job_title, desired_job_title, personal_statement, required_skills, additional_skills, required_qualifications, years_experience, years_in_current_title, current_employer, industry_sector, workArea, itSpecialization, experience_level, skills_experience, education_details, ai_synopsis',
      )
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('tailor-cv profile error', profileError);
      return json({ error: 'We could not load your profile.' }, 500);
    }
    if (!profile) {
      return json({ error: 'Complete your candidate profile first so we have something to tailor.' }, 404);
    }

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select(
        'id, title, description, company, location, type, work_area, specialization, required_skills, required_qualifications, min_years_experience, salary_min, salary_max, company_benefits',
      )
      .eq('id', jobId)
      .maybeSingle();

    if (jobError || !job) {
      return json({ error: 'We could not find that vacancy.' }, 404);
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) return json({ error: 'AI service is not configured.' }, 500);

    const pastedCv = typeof cvText === 'string' ? cvText.trim().slice(0, 20000) : '';

    const profileSummary = [
      `Name: ${profile.full_name ?? 'Not given'}`,
      `Current job title: ${profile.job_title ?? 'Not given'}`,
      `Desired job title: ${profile.desired_job_title ?? 'Not given'}`,
      `Current employer: ${profile.current_employer ?? 'Not given'}`,
      `Industry: ${profile.industry_sector ?? 'Not given'}`,
      `Work area / specialisation: ${profile.workArea ?? ''} ${profile.itSpecialization ?? ''}`.trim(),
      `Experience level: ${profile.experience_level ?? 'Not given'}`,
      `Years of experience: ${profile.years_experience ?? 'Not given'} (years in current title: ${profile.years_in_current_title ?? 'Not given'})`,
      `Skills: ${(profile.required_skills ?? []).join(', ') || 'Not given'}`,
      `Additional skills: ${profile.additional_skills ?? 'Not given'}`,
      `Qualifications: ${(profile.required_qualifications ?? []).join(', ') || 'Not given'}`,
      `Personal statement: ${profile.personal_statement ?? 'Not given'}`,
      profile.skills_experience ? `Skills detail: ${JSON.stringify(profile.skills_experience).slice(0, 3000)}` : '',
      profile.education_details ? `Education: ${JSON.stringify(profile.education_details).slice(0, 2000)}` : '',
      profile.ai_synopsis ? `Profile synopsis: ${profile.ai_synopsis}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const jobSummary = [
      `Job title: ${job.title}`,
      `Company: ${job.company}`,
      `Location: ${job.location}`,
      `Contract type: ${job.type}`,
      `Work area / specialisation: ${job.work_area ?? ''} ${job.specialization ?? ''}`.trim(),
      `Minimum years experience: ${job.min_years_experience ?? 'Not stated'}`,
      `Required skills: ${(job.required_skills ?? []).join(', ') || 'Not stated'}`,
      `Required qualifications: ${(job.required_qualifications ?? []).join(', ') || 'Not stated'}`,
      `Salary: £${job.salary_min ?? '?'} - £${job.salary_max ?? '?'}`,
      `Description: ${(job.description ?? '').slice(0, 8000)}`,
    ].join('\n');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5.6-sol',
        reasoning_effort: 'none',
        messages: [
          {
            role: 'system',
            content:
              'You are an experienced UK recruiter helping a candidate tailor their CV and cover letter to one specific vacancy. ' +
              'Use British English and UK conventions (CV not resume, £ salaries). Be specific, practical and kind. ' +
              'CRITICAL: never invent employers, dates, qualifications, job titles, metrics or achievements that are not in the material provided. ' +
              'If a bullet would be stronger with a number, phrase it so the candidate can add their own figure. ' +
              'Write in the candidate\'s own plain, results-first voice. Keep the cover letter under 250 words.',
          },
          {
            role: 'user',
            content:
              `THE VACANCY\n${jobSummary}\n\nTHE CANDIDATE (Jobz profile)\n${profileSummary}` +
              (pastedCv ? `\n\nTHE CANDIDATE'S CV TEXT\n${pastedCv}` : '\n\n(No CV text supplied — work from the profile above only.)'),
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'return_tailored_cv',
              description: 'Tailoring advice for this candidate and this vacancy.',
              parameters: {
                type: 'object',
                properties: {
                  headline: { type: 'string', description: 'One sentence on how well this CV currently fits the vacancy.' },
                  alignment: {
                    type: 'array',
                    description: '2-4 things the candidate already evidences that this vacancy asks for.',
                    items: { type: 'string' },
                  },
                  gaps: {
                    type: 'array',
                    description: '2-4 things the vacancy asks for that the CV does not currently evidence, with honest advice.',
                    items: {
                      type: 'object',
                      properties: {
                        requirement: { type: 'string' },
                        advice: { type: 'string' },
                      },
                      required: ['requirement', 'advice'],
                      additionalProperties: false,
                    },
                  },
                  suggestedSummary: {
                    type: 'string',
                    description: 'A professional summary paragraph for the top of the CV, aimed at this vacancy.',
                  },
                  rewrittenBullets: {
                    type: 'array',
                    description: '3-6 CV bullet points reworded against this vacancy, using only real experience provided.',
                    items: { type: 'string' },
                  },
                  keywordGaps: {
                    type: 'array',
                    description: '3-8 terms from the job ad a screener would look for that are missing from the CV.',
                    items: {
                      type: 'object',
                      properties: {
                        keyword: { type: 'string' },
                        whereToAdd: { type: 'string' },
                      },
                      required: ['keyword', 'whereToAdd'],
                      additionalProperties: false,
                    },
                  },
                  coverLetterDraft: {
                    type: 'string',
                    description: 'An editable cover letter draft addressed to this employer, under 250 words.',
                  },
                },
                required: [
                  'headline',
                  'alignment',
                  'gaps',
                  'suggestedSummary',
                  'rewrittenBullets',
                  'keywordGaps',
                  'coverLetterDraft',
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'return_tailored_cv' } },
      }),
    });

    if (response.status === 429) {
      return json({ error: 'Lots of requests right now — please try again in a moment.' }, 429);
    }
    if (response.status === 402) {
      return json({ error: 'AI credits exhausted. Please top up to keep using CV tailoring.' }, 402);
    }
    if (response.status === 403) {
      return json({ error: 'AI access is blocked for this workspace. Please contact the site owner.' }, 403);
    }
    if (!response.ok) {
      const detail = await response.text();
      console.error('AI gateway error', response.status, detail);
      return json({ error: 'We could not tailor your CV just now. Please try again.' }, 502);
    }

    const data = await response.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    let result: Record<string, unknown> | null = null;
    if (call?.function?.arguments) {
      try {
        result = JSON.parse(call.function.arguments);
      } catch (_e) {
        result = null;
      }
    }
    if (!result) return json({ error: 'We could not tailor your CV just now. Please try again.' }, 502);

    return json({ result, job: { id: job.id, title: job.title, company: job.company } });
  } catch (error) {
    console.error('tailor-cv error:', error);
    return json({ error: 'Something went wrong tailoring your CV.' }, 500);
  }
});
