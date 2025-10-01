import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

interface CandidateProfile {
  id: string;
  email: string;
  full_name: string;
  job_title: string;
  location: string[];
  min_salary: number;
  max_salary: number;
  required_skills: string[];
  years_experience: number;
}

interface ExternalJob {
  id: string;
  company_id: string;
  job_title: string;
  location: string;
  work_area: string | null;
  specialization: string | null;
  salary_min: number | null;
  salary_max: number | null;
  required_skills: string[] | null;
  years_experience: number | null;
}

interface CompanyInfo {
  id: string;
  company_name: string;
  industry_sector: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting external job matching...');

    // Get active external jobs that haven't been processed for matching yet
    const { data: externalJobs, error: jobsError } = await supabase
      .from('external_jobs')
      .select('*, target_companies(id, company_name, industry_sector)')
      .eq('is_active', true)
      .order('scraped_at', { ascending: false });

    if (jobsError) {
      console.error('Error fetching external jobs:', jobsError);
      throw jobsError;
    }

    console.log(`Found ${externalJobs?.length || 0} external jobs to match`);

    // Get all active candidate profiles in Bristol area
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidate_profiles')
      .select('id, email, full_name, job_title, location, min_salary, max_salary, required_skills, years_experience, workArea, itSpecialization')
      .not('location', 'is', null);

    if (candidatesError) {
      console.error('Error fetching candidates:', candidatesError);
      throw candidatesError;
    }

    // Filter candidates with Bristol locations
    const bristolCandidates = candidates?.filter(c => 
      c.location && c.location.some((loc: string) => loc.startsWith('BS'))
    ) || [];

    console.log(`Found ${bristolCandidates.length} Bristol candidates`);

    let matchesCreated = 0;
    let notificationsSent = 0;

    for (const job of externalJobs || []) {
      const company = job.target_companies as unknown as CompanyInfo;
      
      for (const candidate of bristolCandidates) {
        // Check if already matched/notified
        const { data: existingMatch } = await supabase
          .from('external_job_matches')
          .select('id')
          .eq('external_job_id', job.id)
          .eq('candidate_id', candidate.id)
          .maybeSingle();

        if (existingMatch) continue;

        // Calculate match score
        const matchScore = calculateMatchScore(candidate, job);

        // Only create match if score is above threshold (70%)
        if (matchScore >= 70) {
          // Create match record
          const { data: matchRecord, error: matchError } = await supabase
            .from('external_job_matches')
            .insert({
              external_job_id: job.id,
              candidate_id: candidate.id,
              match_score: matchScore,
              match_explanation: generateMatchExplanation(candidate, job, matchScore),
            })
            .select()
            .single();

          if (matchError) {
            console.error('Error creating match:', matchError);
            continue;
          }

          matchesCreated++;

          // Send push notification
          const { error: notificationError } = await supabase
            .from('push_notifications')
            .insert({
              user_id: candidate.id,
              type: 'external_job_match',
              title: `${company.company_name} is Hiring!`,
              message: `${company.company_name} has a ${job.job_title} role in Bristol - ${matchScore}% match for your profile`,
              related_entity_id: job.id,
            });

          if (notificationError) {
            console.error('Error sending notification:', notificationError);
          } else {
            notificationsSent++;
          }
        }
      }
    }

    console.log(`Matching complete. Matches created: ${matchesCreated}, Notifications sent: ${notificationsSent}`);

    return new Response(
      JSON.stringify({
        success: true,
        matches_created: matchesCreated,
        notifications_sent: notificationsSent,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in match-external-jobs:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function calculateMatchScore(candidate: CandidateProfile, job: ExternalJob): number {
  let score = 0;
  let maxScore = 0;

  // Job title match (30 points)
  maxScore += 30;
  if (candidate.job_title && job.job_title) {
    const candidateTitles = candidate.job_title.toLowerCase();
    const jobTitle = job.job_title.toLowerCase();
    
    if (candidateTitles.includes(jobTitle) || jobTitle.includes(candidateTitles)) {
      score += 30;
    } else if (hasCommonWords(candidateTitles, jobTitle)) {
      score += 15;
    }
  }

  // Location match (20 points)
  maxScore += 20;
  if (candidate.location && job.location) {
    const hasMatchingLocation = candidate.location.some((loc: string) => 
      job.location.toLowerCase().includes(loc.toLowerCase()) ||
      loc.toLowerCase().includes('bristol')
    );
    if (hasMatchingLocation) {
      score += 20;
    }
  }

  // Salary match (20 points)
  maxScore += 20;
  if (job.salary_min && job.salary_max && candidate.min_salary && candidate.max_salary) {
    if (job.salary_max >= candidate.min_salary && job.salary_min <= candidate.max_salary) {
      score += 20;
    }
  } else {
    // If no salary info, give neutral score
    score += 10;
  }

  // Skills match (20 points)
  maxScore += 20;
  if (job.required_skills && candidate.required_skills && 
      job.required_skills.length > 0 && candidate.required_skills.length > 0) {
    const matchingSkills = job.required_skills.filter(skill =>
      candidate.required_skills.some(cs => 
        cs.toLowerCase() === skill.toLowerCase()
      )
    );
    const skillMatchPercentage = matchingSkills.length / job.required_skills.length;
    score += Math.round(skillMatchPercentage * 20);
  } else {
    score += 10;
  }

  // Experience match (10 points)
  maxScore += 10;
  if (job.years_experience && candidate.years_experience) {
    if (candidate.years_experience >= job.years_experience) {
      score += 10;
    } else {
      const experienceRatio = candidate.years_experience / job.years_experience;
      score += Math.round(experienceRatio * 10);
    }
  } else {
    score += 5;
  }

  // Convert to percentage
  return Math.round((score / maxScore) * 100);
}

function hasCommonWords(str1: string, str2: string): boolean {
  const words1 = str1.split(/\s+/).filter(w => w.length > 3);
  const words2 = str2.split(/\s+/).filter(w => w.length > 3);
  
  return words1.some(w1 => words2.some(w2 => w1 === w2));
}

function generateMatchExplanation(candidate: CandidateProfile, job: ExternalJob, score: number): string {
  const reasons: string[] = [];

  if (candidate.job_title && job.job_title) {
    const candidateTitle = candidate.job_title.toLowerCase();
    const jobTitle = job.job_title.toLowerCase();
    if (candidateTitle.includes(jobTitle) || jobTitle.includes(candidateTitle)) {
      reasons.push('Job title is a strong match');
    }
  }

  if (candidate.location && job.location) {
    const hasBristol = candidate.location.some((loc: string) => loc.toLowerCase().includes('bristol'));
    if (hasBristol) {
      reasons.push('Located in Bristol area');
    }
  }

  if (job.salary_min && candidate.min_salary && job.salary_min >= candidate.min_salary) {
    reasons.push('Salary meets your expectations');
  }

  if (reasons.length === 0) {
    reasons.push('This role could be a good fit based on your profile');
  }

  return reasons.join('. ') + '.';
}
