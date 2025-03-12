
import { useState } from "react";
import { Job } from "@/integrations/supabase/types/jobs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuthenticationCheck } from "../utils/authChecks";
import { useProfileCheck } from "../hooks/useProfileCheck";
import { validateEssentialCriteria } from "../utils/applicationValidation";
import { useEmployerValidation } from "@/hooks/useEmployerValidation";

interface ApplicationControlsProps {
  job: Job;
  setIsApplying: (value: boolean) => void;
}

const ApplicationControls = ({ job, setIsApplying }: ApplicationControlsProps) => {
  const { toast } = useToast();
  const checkAuthentication = useAuthenticationCheck();
  const { checkProfile } = useProfileCheck();
  const { validateEmployerApplication } = useEmployerValidation();

  const handleStartApply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const session = await checkAuthentication();
    if (!session) return;

    const profile = await checkProfile(session.user.id);
    if (!profile) return;

    const { isValid, failedCriteria } = validateEssentialCriteria(job, profile);
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Cannot Apply",
        description: (
          <div className="space-y-2">
            <p>You don't meet the following essential criteria:</p>
            <ul className="list-disc pl-4">
              {failedCriteria.map((criteria, index) => (
                <li key={index}>{criteria}</li>
              ))}
            </ul>
          </div>
        )
      });
      return;
    }

    const canApply = await validateEmployerApplication(profile.current_employer, job.company);
    if (!canApply) return;
    
    setIsApplying(true);
  };

  return (
    <Button 
      className="w-1/2 mx-auto block bg-primary hover:bg-primary/90 text-white"
      onClick={handleStartApply}
      size="sm"
    >
      Apply
    </Button>
  );
};

export default ApplicationControls;
