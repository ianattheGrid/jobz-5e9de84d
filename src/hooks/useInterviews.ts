
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useInterviews = (userId?: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["interviews", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required to fetch interviews");
      }
      
      const { data, error } = await supabase
        .from("interviews")
        .select(`
          *,
          job:jobs(id, title, company)
        `)
        .eq('candidate_id', userId)
        .order('scheduled_at', { ascending: true });

      if (error) {
        console.error("Error fetching interviews:", error);
        toast({
          variant: "destructive",
          title: "Error loading interviews",
          description: error.message || "Failed to load your interviews"
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
