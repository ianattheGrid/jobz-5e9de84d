import { Job } from "@/integrations/supabase/types/jobs";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import JobDetails from "./details/JobDetails";
import CommissionDetails from "./details/CommissionDetails";
import ApplicationSection from "./application/ApplicationSection";
import MatchWarningDialog from "./match/MatchWarningDialog";

interface JobCardBackProps {
  job: Job;
}

const JobCardBack = ({ job }: JobCardBackProps) => {
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [showMatchWarning, setShowMatchWarning] = useState(false);

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

  const handleStartApply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const score = await calculateMatchScore();
    setMatchScore(score);
    
    if (score !== null && score < (job.match_threshold || 60)) {
      setShowMatchWarning(true);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "Error",
          description: "Please sign in to apply",
          variant: "destructive",
        });
        return;
      }

      let resumeUrl = "";
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('resumes')
          .upload(fileName, resumeFile);

        if (uploadError) throw uploadError;
        resumeUrl = data.path;
      }

      const { error } = await supabase.from('applications').insert({
        job_id: job.id,
        applicant_id: session.user.id,
        resume_url: resumeUrl,
        cover_letter: coverLetter,
        match_score: matchScore
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application submitted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm h-full overflow-y-auto">
      <h3 className="text-xl font-semibold text-red-800 mb-4">{job.title}</h3>
      
      {job.candidate_commission && (
        <CommissionDetails candidateCommission={job.candidate_commission} />
      )}

      <JobDetails job={job} />

      <ApplicationSection
        onStartApply={handleStartApply}
        onSubmit={handleApply}
        coverLetter={coverLetter}
        setCoverLetter={setCoverLetter}
        setResumeFile={setResumeFile}
      />

      <MatchWarningDialog
        open={showMatchWarning}
        onOpenChange={setShowMatchWarning}
        matchScore={matchScore}
        matchThreshold={job.match_threshold || 60}
        onProceed={() => {
          setShowMatchWarning(false);
        }}
      />
    </div>
  );
};

export default JobCardBack;