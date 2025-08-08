import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useInterviewFeedback = (interviewId?: number, candidateId?: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["interview-feedback", interviewId, candidateId],
    queryFn: async () => {
      if (!interviewId || !candidateId) {
        throw new Error("Interview ID and Candidate ID are required");
      }
      
      const { data, error } = await supabase
        .from("interview_feedback")
        .select("*")
        .eq('interview_id', interviewId)
        .eq('candidate_id', candidateId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching interview feedback:", error);
        toast({
          variant: "destructive",
          title: "Error loading feedback",
          description: error.message || "Failed to load interview feedback"
        });
        throw error;
      }
      
      return data;
    },
    enabled: !!interviewId && !!candidateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });
};