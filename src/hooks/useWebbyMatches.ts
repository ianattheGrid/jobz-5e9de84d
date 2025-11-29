import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface JobMatch {
  id: number;
  title: string;
  company: string;
  location: string;
  salary_min: number;
  salary_max: number;
  type: string;
  match_reason: string;
  match_score: number;
}

interface MatchesData {
  primary: JobMatch[];
  serendipitous: JobMatch[];
  unexpected: JobMatch[];
}

export const useWebbyMatches = (refreshTrigger?: number) => {
  const [matches, setMatches] = useState<MatchesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('webby-match', {
        body: {}
      });

      if (functionError) throw functionError;

      setMatches(data);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [refreshTrigger]);

  return { matches, loading, error, refetch: fetchMatches };
};