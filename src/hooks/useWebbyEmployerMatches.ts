import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CandidateMatch {
  candidate_id: string;
  category: string;
  match_score: number;
  match_reason: string;
  candidate: {
    id: string;
    full_name: string | null;
    job_title: string;
    location: string[] | null;
    years_experience: number;
    required_skills: string[] | null;
    profile_picture_url: string | null;
  };
  webby_profile?: {
    rough_location?: string | null;
    min_hourly_rate?: number | null;
    min_annual_salary?: number | null;
    availability_slots?: any;
    hours_per_week_min?: number | null;
    hours_per_week_max?: number | null;
    skills_tags?: string[] | null;
    soft_skills_self_assessed?: string[] | null;
    environment_preferences?: string[] | null;
    life_outside_work?: string | null;
  };
}

interface EmployerMatches {
  primary: CandidateMatch[];
  hidden_gems: CandidateMatch[];
  trainable: CandidateMatch[];
}

export const useWebbyEmployerMatches = () => {
  const [matches, setMatches] = useState<EmployerMatches>({
    primary: [],
    hidden_gems: [],
    trainable: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('webby-match-employer');

      if (functionError) {
        console.error('Error fetching employer matches:', functionError);
        setError(functionError.message);
        return;
      }

      setMatches(data || { primary: [], hidden_gems: [], trainable: [] });
    } catch (err) {
      console.error('Error in fetchMatches:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return {
    matches,
    loading,
    error,
    refresh: fetchMatches,
  };
};
