
import { useState } from "react";
import { X } from "lucide-react";
import { Job } from "@/integrations/supabase/types/jobs";
import JobDetails from "./details/JobDetails";
import CommissionDetails from "./details/CommissionDetails";
import ApplicationSection from "./application/ApplicationSection";
import ApplicationStatus from "./application/ApplicationStatus";
import ApplicationControls from "./application/ApplicationControls";
import { useApplication } from "./hooks/useApplication";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MatchWarningContent } from "./match/MatchWarningContent";

interface JobCardBackProps {
  job: Job;
  onClose: () => void;
}

const JobCardBack = ({ job, onClose }: JobCardBackProps) => {
  const { toast } = useToast();
  const {
    isApplying,
    setIsApplying,
    coverLetter,
    setCoverLetter,
    resumeFile,
    setResumeFile,
    handleStartApply,
    handleSubmitApplication,
    matchWarningOpen,
    setMatchWarningOpen,
    matchWarningInfo,
    handleProceedWithApplication
  } = useApplication(job.id, job.employer_id || '');

  // Check for existing application
  const [application, setApplication] = useState<any>(null);
  
  // Handle accepting an application
  const handleAccept = async () => {
    if (!application) return;
    
    const { error } = await supabase
      .from('applications')
      .update({ candidate_accepted: true })
      .eq('id', application.id);
      
    if (error) throw error;
    
    // Refresh application data
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('id', application.id)
      .single();
      
    setApplication(data);
  };

  return (
    <div 
      className="h-full p-6 bg-[#2A2A2A] text-foreground overflow-y-auto rounded-lg"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="relative p-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-0 right-0 p-2 rounded-full hover:bg-accent/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {job.candidate_commission && (
          <CommissionDetails candidateCommission={job.candidate_commission} />
        )}

        <JobDetails job={job} />
        
        <div className="mt-8">
          {application ? (
            <ApplicationStatus 
              status={application}
              onAccept={handleAccept}
              onChat={() => window.location.href = `/messages/${application.id}`}
            />
          ) : (
            isApplying ? (
              <ApplicationSection
                jobId={job.id}
                employerId={job.employer_id || ''}
                onSubmit={handleSubmitApplication}
                setResumeFile={setResumeFile}
                setCoverLetter={setCoverLetter}
                coverLetter={coverLetter}
                onStartApply={handleStartApply}
                isApplying={isApplying}
                setIsApplying={setIsApplying}
              />
            ) : (
              <ApplicationControls 
                job={job}
                setIsApplying={setIsApplying}
              />
            )
          )}
        </div>
      </div>
      
      {/* Match warning dialog */}
      <Dialog open={matchWarningOpen} onOpenChange={setMatchWarningOpen}>
        <DialogContent className="sm:max-w-md">
          {matchWarningInfo && (
            <MatchWarningContent 
              matchWarningInfo={matchWarningInfo} 
              onCancel={() => setMatchWarningOpen(false)} 
              onProceed={handleProceedWithApplication} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobCardBack;
