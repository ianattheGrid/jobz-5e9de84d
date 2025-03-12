
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useInterviews = (userId?: string) => {
  return useQuery({
    queryKey: ["interviews", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interviews")
        .select(`
          *,
          job:jobs(id, title, company)
        `)
        .eq('candidate_id', userId)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};
