
import { Job } from "@/integrations/supabase/types/jobs";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";

interface ValidationResult {
  isValid: boolean;
  failedCriteria: string[];
}

export const validateEssentialCriteria = (
  job: Job,
  candidateProfile: CandidateProfile
): ValidationResult => {
  const failedCriteria: string[] = [];

  // Check job title match if essential
  if (job.title_essential && candidateProfile.job_title) {
    const jobTitleLower = job.title.toLowerCase();
    
    // Process candidate job titles correctly whether string or array
    let candidateTitles: string[] = [];
    
    if (typeof candidateProfile.job_title === 'string') {
      try {
        // Try to parse as JSON first (for array stored as string)
        const parsedTitles = JSON.parse(candidateProfile.job_title);
        if (Array.isArray(parsedTitles)) {
          candidateTitles = parsedTitles.map(title => String(title).toLowerCase());
        } else {
          candidateTitles = [candidateProfile.job_title.toLowerCase()];
        }
      } catch (e) {
        // If parsing fails, treat as regular string
        candidateTitles = [candidateProfile.job_title.toLowerCase()];
      }
    } else if (Array.isArray(candidateProfile.job_title)) {
      candidateTitles = candidateProfile.job_title.map(title => String(title).toLowerCase());
    }
    
    // Check if any of the candidate's job titles match the required title
    if (!candidateTitles.includes(jobTitleLower)) {
      failedCriteria.push("Job title does not match the required title");
    }
  }

  // Check years of experience if essential, with 1 year flexibility
  if (job.years_experience_essential && 
      job.min_years_experience && 
      candidateProfile.years_experience < (job.min_years_experience - 1)) {
    failedCriteria.push(`Minimum ${job.min_years_experience} years of experience required (or close)`);
  }

  // Check years in current title with 1 year flexibility
  if (job.min_years_in_title > 0 && 
      (candidateProfile.years_in_current_title < (job.min_years_in_title - 1))) {
    failedCriteria.push(`Minimum ${job.min_years_in_title} years in current title required (or close)`);
  }

  // Check salary expectations if essential
  if (job.salary_essential) {
    const candidateMinInRange = candidateProfile.min_salary <= job.salary_max;
    const candidateMaxInRange = candidateProfile.max_salary >= job.salary_min;
    if (!candidateMinInRange || !candidateMaxInRange) {
      failedCriteria.push("Salary expectations do not match the job's salary range");
    }
  }

  // Check required skills if essential
  if (job.skills_essential && job.required_skills) {
    const candidateSkills = new Set(candidateProfile.required_skills || []);
    const missingSkills = job.required_skills.filter(skill => !candidateSkills.has(skill));
    if (missingSkills.length > 0) {
      failedCriteria.push(`Missing required skills: ${missingSkills.join(", ")}`);
    }
  }

  // Check qualifications if essential
  if (job.qualification_essential && job.required_qualifications) {
    const candidateQualification = candidateProfile.additional_skills || "";
    const hasRequiredQualification = job.required_qualifications.some(
      qual => candidateQualification.includes(qual)
    );
    if (!hasRequiredQualification) {
      failedCriteria.push("Required qualification not met");
    }
  }

  // Check citizenship/work eligibility if essential
  if (job.citizenship_essential && 
      job.required_citizenship && 
      job.required_citizenship !== candidateProfile.work_eligibility) {
    failedCriteria.push("Work eligibility requirements not met");
  }

  return {
    isValid: failedCriteria.length === 0,
    failedCriteria
  };
};
