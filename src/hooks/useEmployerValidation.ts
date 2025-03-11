
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useEmployerValidation = () => {
  const { toast } = useToast();

  const validateEmployerApplication = async (
    candidateEmployer: string | null | undefined,
    jobCompany: string
  ): Promise<boolean> => {
    if (!candidateEmployer) return true;

    const { data, error } = await supabase.rpc('can_apply_to_job', {
      candidate_employer: candidateEmployer,
      job_company: jobCompany
    });

    if (error) {
      console.error('Error checking employer match:', error);
      return true; // Allow application if check fails
    }

    if (!data) {
      toast({
        variant: "destructive",
        title: "Cannot Apply",
        description: "You cannot apply to positions at your current employer"
      });
      return false;
    }

    return true;
  };

  return { validateEmployerApplication };
};
