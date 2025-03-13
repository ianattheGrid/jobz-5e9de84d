import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { calculateSkillsMatchScore } from "../utils/skillsMatching";

export const useMatchScore = (profile: CandidateProfile, job: any) => {
  const titleMatch = () => {
    if (!profile.job_title || !job.title) return 0;
    const profileTitle = profile.job_title.toLowerCase();
    const jobTitle = job.title.toLowerCase();
    
    if (profileTitle === jobTitle) return 1;
    if (profileTitle.includes(jobTitle) || jobTitle.includes(profileTitle)) return 0.8;
    return 0;
  };

  const specializationMatch = () => {
    if (!profile.job_title || !job.specialization) return 0;
    const profileTitle = profile.job_title.toLowerCase();
    const spec = job.specialization.toLowerCase();
    
    if (profileTitle.includes(spec)) return 1;
    if (spec.includes(profileTitle)) return 0.8;
    return 0;
  };

  const locationMatch = () => {
    if (!profile.location || !job.location) return 0;
    return profile.location.some(loc => 
      loc.toLowerCase() === job.location.toLowerCase()
    ) ? 1 : 0;
  };

  const skillsMatch = async () => {
    if (!profile.required_skills || !job.required_skills) return 0;
    return calculateSkillsMatchScore(
      profile.required_skills, 
      job.required_skills,
      profile.cv_url
    );
  };

  const experienceMatch = () => {
    if (profile.years_experience === undefined || job.min_years_experience === undefined) return 0;
    
    const yearsDiff = profile.years_experience - job.min_years_experience;
    if (yearsDiff >= 0) return 1;
    if (yearsDiff >= -2) return 0.8; // Close to required experience
    if (yearsDiff >= -3) return 0.5; // Somewhat close
    return 0;
  };

  const salaryMatch = () => {
    if (!profile.min_salary || !profile.max_salary || !job.salary_min || !job.salary_max) return 0;

    const profileRange = profile.max_salary - profile.min_salary;
    const jobRange = job.salary_max - job.salary_min;
    
    const overlapStart = Math.max(profile.min_salary, job.salary_min);
    const overlapEnd = Math.min(profile.max_salary, job.salary_max);
    const overlapAmount = Math.max(0, overlapEnd - overlapStart);
    
    const profileCenter = (profile.max_salary + profile.min_salary) / 2;
    const jobCenter = (job.salary_max + job.salary_min) / 2;
    
    const centerDistance = Math.abs(profileCenter - jobCenter);
    const maxPossibleDistance = Math.max(profileRange, jobRange);
    const centerScore = 1 - (centerDistance / maxPossibleDistance);
    
    return (overlapAmount > 0) 
      ? (0.7 * (overlapAmount / Math.min(profileRange, jobRange))) + (0.3 * centerScore)
      : 0.3 * centerScore;
  };

  const calculateTotalScore = async () => {
    let totalScore = 0;
    totalScore += titleMatch() * 0.30;          // Job title match (30%)
    totalScore += await skillsMatch() * 0.15;   // Skills match (15%)
    totalScore += locationMatch() * 0.15;       // Location match (15%)
    totalScore += experienceMatch() * 0.15;     // Experience match (15%)
    totalScore += specializationMatch() * 0.15; // Specialization match (15%)
    totalScore += salaryMatch() * 0.10;         // Salary match (10%)
    return totalScore;
  };

  const totalScore = calculateTotalScore();

  return {
    titleMatch,
    specializationMatch,
    locationMatch,
    skillsMatch,
    experienceMatch,
    salaryMatch,
    totalScore
  };
};
