import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import JobCardFront from "./job-card/JobCardFront";
import JobCardBack from "./job-card/JobCardBack";
import { Job } from "@/integrations/supabase/types/jobs";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();

  const handleStartApplication = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to apply for jobs",
      });
      return;
    }

    // Check if candidate works for the employer
    const { data: candidateProfile } = await supabase
      .from('candidate_profiles')
      .select('current_employer')
      .eq('id', session.user.id)
      .single();

    if (candidateProfile?.current_employer?.toLowerCase() === job.company.toLowerCase()) {
      toast({
        variant: "destructive",
        title: "Application blocked",
        description: "You cannot apply to positions at your current employer",
      });
      return;
    }

    // Check if already applied
    const { data: existingApplication } = await supabase
      .from('applications')
      .select('id, status')
      .eq('job_id', job.id)
      .eq('applicant_id', session.user.id)
      .maybeSingle();

    if (existingApplication) {
      toast({
        variant: "destructive",
        title: "Already applied",
        description: `You have already applied to this position (Status: ${existingApplication.status})`,
      });
      return;
    }

    setIsFlipped(true);
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative h-[600px] w-full cursor-pointer" onClick={handleCardClick}>
      <Card 
        className={`absolute inset-0 w-full h-full transition-transform duration-500 preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <JobCardFront job={job} onApply={handleStartApplication} />
        </div>
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <JobCardBack job={job} onClose={() => setIsFlipped(false)} />
        </div>
      </Card>
    </div>
  );
};

export default JobCard;