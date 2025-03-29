
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useInterviewSlots = (userId?: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["interview-slots", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required to fetch interview slots");
      }
      
      const { data, error } = await supabase
        .from("interview_slots")
        .select(`
          *,
          job:jobs(id, title, company)
        `)
        .eq('candidate_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching interview slots:", error);
        toast({
          variant: "destructive",
          title: "Error loading interview slots",
          description: error.message || "Failed to load your interview slots"
        });
        throw error;
      }
      
      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });
};
