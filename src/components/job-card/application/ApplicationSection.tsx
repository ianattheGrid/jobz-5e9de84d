
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ApplicationForm from "./ApplicationForm";

interface ApplicationSectionProps {
  jobId: number;
  employerId: string;
  onStartApply: (e: React.MouseEvent) => Promise<void>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  coverLetter: string;
  setCoverLetter: (value: string) => void;
  setResumeFile: (file: File | null) => void;
}

const ApplicationSection = ({
  jobId,
  employerId,
  onStartApply,
  onSubmit,
  coverLetter,
  setCoverLetter,
  setResumeFile,
}: ApplicationSectionProps) => {
  const [isApplying, setIsApplying] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadApplication();
  }, [jobId]);

  const loadApplication = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('job_id', jobId)
      .eq('applicant_id', session.user.id)
      .single();

    if (error) {
      console.error('Error loading application:', error);
      return;
    }

    setApplication(data);
  };

  const handleAccept = async () => {
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

  if (application) {
    if (application.employer_accepted && !application.candidate_accepted) {
      return (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-green-600">The employer has accepted your application!</p>
          <Button 
            onClick={handleAccept}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Accept and View Full Details
          </Button>
        </div>
      );
    }

    if (application.employer_accepted && application.candidate_accepted) {
      return (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-green-600">Match confirmed! You can now arrange an interview.</p>
          <Button 
            onClick={() => window.location.href = `/messages/${application.id}`}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Start Chat
          </Button>
        </div>
      );
    }

    if (!application.employer_accepted) {
      return (
        <div className="mt-6">
          <p className="text-sm text-gray-600">Application submitted - awaiting employer response</p>
        </div>
      );
    }
  }

  return (
    <div className="mt-6">
      {!isApplying ? (
        <Button 
          className="w-1/2 mx-auto block bg-primary hover:bg-primary/90 text-white"
          onClick={onStartApply}
          size="sm"
        >
          Apply
        </Button>
      ) : (
        <ApplicationForm
          onSubmit={onSubmit}
          onCancel={() => setIsApplying(false)}
          setCoverLetter={setCoverLetter}
          setResumeFile={setResumeFile}
          coverLetter={coverLetter}
        />
      )}
    </div>
  );
};

export default ApplicationSection;
