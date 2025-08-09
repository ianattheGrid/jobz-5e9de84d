
import { X } from "lucide-react";
import { Job } from "@/integrations/supabase/types/jobs";
import JobDetails from "./details/JobDetails";
import CommissionDetails from "./details/CommissionDetails";
import ApplicationSection from "./application/ApplicationSection";
import ApplicationStatus from "./application/ApplicationStatus";
import { useApplication } from "./hooks/useApplication";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MatchWarningContent } from "./match/MatchWarningContent";
import { Skeleton } from "@/components/ui/skeleton";

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
    handleProceedWithApplication,
    application,
    applicationLoading,
    handleAccept
  } = useApplication(job.id, job.employer_id || '');

  return (
    <div 
      className="h-full p-6 bg-card text-foreground overflow-y-auto rounded-lg cursor-pointer"
      onClick={(e: any) => {
        const target = (e.target as HTMLElement);
        const interactive = target.closest('button, a, input, textarea, select, label, [role="dialog"], [role="menu"], [role="listbox"]');
        if (!interactive) {
          onClose();
        }
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
          {applicationLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : application ? (
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
