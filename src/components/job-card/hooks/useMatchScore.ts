import { CandidateProfile } from "@/integrations/supabase/types/profiles";

export const useMatchScore = (profile: CandidateProfile, job: any) => {
  const titleMatch = () => {
    if (!profile.job_title || !job.title) return 0;
    return profile.job_title.toLowerCase().includes(job.title.toLowerCase()) ? 1 : 0;
  };

  const specializationMatch = () => {
    if (!profile.job_title || !job.specialization) return 0;
    return profile.job_title.toLowerCase().includes(job.specialization.toLowerCase()) ? 1 : 0;
  };

  const locationMatch = () => {
    if (!profile.location || !job.location) return 0;
    return profile.location.some(loc => 
      loc.toLowerCase() === job.location.toLowerCase()
    ) ? 1 : 0;
  };

  const skillsMatch = () => {
    if (!profile.required_skills || !job.required_skills) return 0;
    const profileSkillsLower = profile.required_skills.map(skill => skill.toLowerCase());
    const jobSkillsLower = job.required_skills.map(skill => skill.toLowerCase());
    let matches = 0;
    for (const skill of jobSkillsLower) {
      if (profileSkillsLower.includes(skill)) {
        matches++;
      }
    }
    return matches / jobSkillsLower.length;
  };

  const experienceMatch = () => {
    if (profile.years_experience === undefined || job.min_years_experience === undefined) return 0;
    return profile.years_experience >= job.min_years_experience ? 1 : 0;
  };

  const salaryMatch = () => {
    if (!profile.min_salary || !profile.max_salary || !job.salary_min || !job.salary_max) return 0;

    const profileSalaryRange = profile.max_salary - profile.min_salary;
    const jobSalaryRange = job.salary_max - job.salary_min;

    const overlapStart = Math.max(profile.min_salary, job.salary_min);
    const overlapEnd = Math.min(profile.max_salary, job.salary_max);

    const overlapAmount = Math.max(0, overlapEnd - overlapStart);

    const combinedRange = profileSalaryRange + jobSalaryRange;

    if (combinedRange === 0) {
      return 0;
    }

    return overlapAmount / combinedRange;
  };

  const calculateTotalScore = () => {
    let totalScore = 0;
    totalScore += titleMatch() * 0.15;
    totalScore += specializationMatch() * 0.10;
    totalScore += locationMatch() * 0.20;
    totalScore += skillsMatch() * 0.30;
    totalScore += experienceMatch() * 0.15;
    totalScore += salaryMatch() * 0.10;
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
