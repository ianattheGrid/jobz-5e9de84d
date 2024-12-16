import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import JobDetails from "./details/JobDetails";
import CommissionDetails from "./details/CommissionDetails";
import ApplicationSection from "./application/ApplicationSection";
import MatchWarningDialog from "./match/MatchWarningDialog";
import { useAuthenticationCheck, useProfileCheck } from "./utils/authChecks";
import { Job } from "@/integrations/supabase/types/jobs";

interface JobCardBackProps {
  job: Job;
}

const JobCardBack = ({ job }: JobCardBackProps) => {
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [showMatchWarning, setShowMatchWarning] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  const checkAuthentication = useAuthenticationCheck();
  const checkProfile = useProfileCheck();

  const calculateMatchScore = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data: candidateProfile } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!candidateProfile) return null;

      const { data, error } = await supabase.rpc('calculate_match_score', {
        job_title_a: job.title,
        job_title_b: candidateProfile.job_title,
        years_exp_a: 0,
        years_exp_b: candidateProfile.years_experience,
        location_a: job.location,
        location_b: candidateProfile.location,
        salary_min_a: job.salary_min,
        salary_max_a: job.salary_max,
        salary_min_b: candidateProfile.min_salary,
        salary_max_b: candidateProfile.max_salary,
        skills_a: job.required_skills || [],
        skills_b: candidateProfile.required_skills || []
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error calculating match score:', error);
      return null;
    }
  };

  const handleFileChange = (file: File | null) => {
    setResumeFile(file);
  };

  const handleCoverLetterChange = (text: string) => {
    setCoverLetter(text);
  };

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

      const { error: uploadError, data } = await supabase.storage
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
        });

      if (applicationError) throw applicationError;

      toast({
        title: "Success",
        description: "Your application has been submitted",
      });

      setIsApplying(false);
      setResumeFile(null);
      setCoverLetter("");
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
      
      {isApplying ? (
        <ApplicationSection
          onSubmit={handleSubmitApplication}
          setResumeFile={handleFileChange}
          setCoverLetter={handleCoverLetterChange}
          coverLetter={coverLetter}
          onStartApply={handleStartApply}
        />
      ) : (
        <button
          onClick={handleStartApply}
          className="mt-4 w-full bg-red-800 text-white py-2 px-4 rounded hover:bg-red-900 transition-colors"
        >
          Apply Now
        </button>
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