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

interface JobCardBackProps {
  job: Job;
  onClose: () => void;
}

const JobCardBack = ({ job, onClose }: JobCardBackProps) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  
  const { application, handleAccept } = useApplication(job);
  const { toast } = useToast();

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      let resumeUrl = null;

      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('cvs')
          .upload(fileName, resumeFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('cvs')
          .getPublicUrl(fileName);
          
        resumeUrl = urlData.publicUrl;
      }

      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          applicant_id: session.user.id,
          resume_url: resumeUrl,
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
                onStartApply={async () => Promise.resolve()}
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
    </div>
  );
};

export default JobCardBack;
