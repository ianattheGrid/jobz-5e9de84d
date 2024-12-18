import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/integrations/supabase/types/jobs";

export const useMatchScore = (job: Job) => {
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [showMatchWarning, setShowMatchWarning] = useState(false);

  const calculateMatchScore = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data: candidateProfile } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!candidateProfile) return null;

      // Simplified scoring system
      let score = 0;
      let totalCriteria = 0;

      // Title match
      if (job.title.toLowerCase() === candidateProfile.job_title.toLowerCase()) {
        score += 1;
      }
      totalCriteria += 1;

      // Experience match
      if (candidateProfile.years_experience >= (job.min_years_experience || 0)) {
        score += 1;
      }
      totalCriteria += 1;

      // Location match
      if (job.location.toLowerCase() === candidateProfile.location.toLowerCase()) {
        score += 1;
      }
      totalCriteria += 1;

      // Salary match
      if (
        candidateProfile.min_salary <= job.salary_max &&
        candidateProfile.max_salary >= job.salary_min
      ) {
        score += 1;
      }
      totalCriteria += 1;

      // Skills match (if available)
      if (job.required_skills && candidateProfile.required_skills) {
        const jobSkills = new Set(job.required_skills);
        const candidateSkills = new Set(candidateProfile.required_skills);
        const matchingSkills = [...jobSkills].filter(skill => 
          candidateSkills.has(skill)
        );
        if (matchingSkills.length > 0) {
          score += 1;
        }
      }
      totalCriteria += 1;

      const finalScore = Math.round((score / totalCriteria) * 100);
      return finalScore;
    } catch (error) {
      console.error('Error calculating match score:', error);
      return null;
    }
  };

  return {
    matchScore,
    setMatchScore,
    showMatchWarning,
    setShowMatchWarning,
    calculateMatchScore
  };
};