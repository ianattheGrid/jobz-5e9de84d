import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/integrations/supabase/types/jobs";

export const useApplication = (job: Job) => {
  const [application, setApplication] = useState<any>(null);
  const { toast } = useToast();

  const loadApplication = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', job.id)
        .eq('applicant_id', session.user.id)
        .maybeSingle(); // Changed from .single() to .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading application:', error);
        return;
      }

      setApplication(data);
    } catch (error) {
      console.error('Error in loadApplication:', error);
    }
  };

  const handleAccept = async () => {
    if (!application) return;
    
    const { error } = await supabase
      .from('applications')
      .update({ 
        candidate_accepted: true,
        candidate_viewed_at: new Date().toISOString()
      })
      .eq('id', application.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept application",
      });
      return;
    }

    toast({
      title: "Success",
      description: "You have accepted this opportunity",
    });
    
    loadApplication();
  };

  useEffect(() => {
    loadApplication();
  }, [job.id]);

  return {
    application,
    handleAccept,
    loadApplication
  };
};