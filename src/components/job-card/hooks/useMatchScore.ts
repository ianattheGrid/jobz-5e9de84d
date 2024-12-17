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

      const { data, error } = await supabase.rpc('calculate_match_score', {
        job_title_a: job.title,
        job_title_b: candidateProfile.job_title,
        years_exp_a: 0,
        years_exp_b: candidateProfile.years_experience,
        location_a: job.location,
        location_b: candidateProfile.location,
        salary_min_a: job.salary_min,
        salary_max_a: job.salary_max,
        salary_min_b: candidateProfile.min_salary,
        salary_max_b: candidateProfile.max_salary,
        skills_a: job.required_skills || [],
        skills_b: candidateProfile.required_skills || []
      });

      if (error) throw error;
      return data;
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