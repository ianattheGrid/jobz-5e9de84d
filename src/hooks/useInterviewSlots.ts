
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useInterviewSlots = (userId?: string) => {
  return useQuery({
    queryKey: ["interview-slots", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interview_slots")
        .select(`
          *,
          job:jobs(id, title, company)
        `)
        .eq('candidate_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};
