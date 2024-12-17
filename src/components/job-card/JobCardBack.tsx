import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import JobDetails from "./details/JobDetails";
import CommissionDetails from "./details/CommissionDetails";
import ApplicationSection from "./application/ApplicationSection";
import MatchWarningDialog from "./match/MatchWarningDialog";
import { useAuthenticationCheck, useProfileCheck } from "./utils/authChecks";
import { JobCardBackProps } from "./types";
import ApplicationStatus from "./application/ApplicationStatus";
import ApplicationControls from "./application/ApplicationControls";
import { useApplication } from "./hooks/useApplication";
import { useMatchScore } from "./hooks/useMatchScore";

const JobCardBack = ({ job, onClose }: JobCardBackProps) => {
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  
  const checkAuthentication = useAuthenticationCheck();
  const checkProfile = useProfileCheck();
  
  const { application, handleAccept } = useApplication(job);
  const { 
    matchScore, 
    setMatchScore, 
    showMatchWarning, 
    setShowMatchWarning, 
    calculateMatchScore 
  } = useMatchScore(job);

  const handleStartApply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const session = await checkAuthentication();
    if (!session) return;

    const profile = await checkProfile(session.user.id);
    if (!profile) return;

    const score = await calculateMatchScore();
    setMatchScore(score);
    
    if (score && score < job.match_threshold) {
      setShowMatchWarning(true);
      return;
    }
    
    setIsApplying(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const session = await checkAuthentication();
      if (!session) return;

      if (!resumeFile) {
        toast({
          title: "Resume Required",
          description: "Please upload your resume",
          variant: "destructive",
        });
        return;
      }

      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, resumeFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('cvs')
        .getPublicUrl(fileName);

      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          applicant_id: session.user.id,
          resume_url: urlData.publicUrl,
          cover_letter: coverLetter,
          employer_accepted: false,
          candidate_accepted: false,
        });

      if (applicationError) throw applicationError;

      toast({
        title: "Success",
        description: "Your application has been submitted",
      });

      setIsApplying(false);
      setResumeFile(null);
      setCoverLetter("");
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="absolute inset-0 bg-white p-6 transform transition-transform duration-500 ease-in-out"
      onClick={(e) => e.stopPropagation()}
    >
      <JobDetails job={job} />
      <CommissionDetails candidateCommission={job.candidate_commission} />
      
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
          />
        ) : (
          <ApplicationControls 
            isApplying={isApplying}
            onStartApply={handleStartApply}
          />
        )
      )}

      {showMatchWarning && matchScore !== null && (
        <MatchWarningDialog
          open={showMatchWarning}
          onOpenChange={setShowMatchWarning}
          matchScore={matchScore}
          matchThreshold={job.match_threshold}
          onProceed={() => {
            setShowMatchWarning(false);
            setIsApplying(true);
          }}
        />
      )}
    </div>
  );
};

export default JobCardBack;