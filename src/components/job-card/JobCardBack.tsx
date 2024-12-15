import { Job } from "@/integrations/supabase/types/jobs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import JobDetails from "./details/JobDetails";
import ApplicationForm from "./application/ApplicationForm";
import MatchWarningDialog from "./match/MatchWarningDialog";
import { formatSalary } from "./utils";

interface JobCardBackProps {
  job: Job;
}

const JobCardBack = ({ job }: JobCardBackProps) => {
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [showMatchWarning, setShowMatchWarning] = useState(false);

  const calculateReferralCommission = (totalCommission: number) => {
    return Math.floor(totalCommission * 0.3);
  };

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
    } else {
      setIsApplying(true);
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
      setIsApplying(false);
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
        <div className="mb-4 p-3 bg-red-50 rounded-md">
          <p className="text-sm font-medium text-red-700 mb-2">
            "You're Hired" Bonus Details
          </p>
          <div className="text-sm text-red-600 space-y-1">
            <p>Total Bonus: {formatSalary(job.candidate_commission)}</p>
            <div className="text-xs space-y-0.5">
              <p>• Candidate: {formatSalary(job.candidate_commission - calculateReferralCommission(job.candidate_commission))}</p>
              <p>• Referral: {formatSalary(calculateReferralCommission(job.candidate_commission))}</p>
            </div>
          </div>
        </div>
      )}

      <JobDetails job={job} />

      <div>
        {!isApplying ? (
          <Button 
            className="w-full bg-red-800 hover:bg-red-900"
            onClick={handleStartApply}
          >
            Apply Now
          </Button>
        ) : (
          <ApplicationForm
            onSubmit={handleApply}
            onCancel={() => setIsApplying(false)}
            setCoverLetter={setCoverLetter}
            setResumeFile={setResumeFile}
            coverLetter={coverLetter}
          />
        )}
      </div>

      <MatchWarningDialog
        open={showMatchWarning}
        onOpenChange={setShowMatchWarning}
        matchScore={matchScore}
        matchThreshold={job.match_threshold || 60}
        onProceed={() => {
          setShowMatchWarning(false);
          setIsApplying(true);
        }}
      />
    </div>
  );
};

export default JobCardBack;
