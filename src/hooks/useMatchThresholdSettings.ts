
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useMatchThresholdSettings = (jobId: number) => {
  const [threshold, setThreshold] = useState<number>(60);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchThreshold = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('match_threshold')
          .eq('id', jobId)
          .single();

        if (error) throw error;
        
        if (data && data.match_threshold !== null) {
          setThreshold(data.match_threshold);
        }
      } catch (error: any) {
        console.error('Error fetching match threshold:', error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchThreshold();
    }
  }, [jobId]);

  const updateThreshold = async (newThreshold: number) => {
    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from('jobs')
        .update({ match_threshold: newThreshold })
        .eq('id', jobId);
      
      if (error) throw error;
      
      setThreshold(newThreshold);
      toast({
        title: "Match threshold updated",
        description: `Candidates will now need a ${newThreshold}% match to be highlighted for this job.`
      });
    } catch (error: any) {
      console.error('Error updating match threshold:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update match threshold. Please try again."
      });
    } finally {
      setUpdating(false);
    }
  };

  return {
    threshold,
    loading,
    updating,
    updateThreshold
  };
};
