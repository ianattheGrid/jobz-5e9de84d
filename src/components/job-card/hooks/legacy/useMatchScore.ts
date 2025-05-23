import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/integrations/supabase/types/jobs";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";

export const useMatchScore = (profile: CandidateProfile, job: any) => {
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

      // Simplified scoring system (can be enhanced later)
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
      const locationMatchScore = locationMatch();
      score += locationMatchScore;
      totalCriteria += 1;

      // Salary match
      if (
        candidateProfile.min_salary <= job.salary_max &&
        candidateProfile.max_salary >= job.salary_min
      ) {
        score += 1;
      }
      totalCriteria += 1;

      const finalScore = Math.round((score / totalCriteria) * 100);
      return finalScore;
    } catch (error) {
      console.error('Error calculating match score:', error);
      return null;
    }
  };

  const locationMatch = () => {
    if (!profile.location || !job.location) return 0;
    return profile.location.some(loc => 
      loc.toLowerCase() === job.location.toLowerCase()
    ) ? 1 : 0;
  };

  return {
    matchScore,
    setMatchScore,
    showMatchWarning,
    setShowMatchWarning,
    calculateMatchScore
  };
};
