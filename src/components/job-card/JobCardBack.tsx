import { Job } from "@/integrations/supabase/types/jobs";
import { Button } from "@/components/ui/button";
import { formatBenefits } from "./utils";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2 text-red-800">Full Description</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-2 text-red-800">Benefits</h4>
          <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
            <li>Holiday Entitlement: {job.holiday_entitlement || 25} days</li>
            {formatBenefits(job.company_benefits).map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>

        <div>
          {!isApplying ? (
            <Button 
              className="w-full bg-red-800 hover:bg-red-900"
              onClick={handleStartApply}
            >
              Apply Now
            </Button>
          ) : (
            <form onSubmit={handleApply} onClick={(e) => e.stopPropagation()} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-red-800">Resume</label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-red-800">Cover Letter</label>
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write your cover letter..."
                  className="h-32"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  className="flex-1 bg-red-800 hover:bg-red-900"
                >
                  Submit Application
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsApplying(false)}
                  className="border-red-800 text-red-800 hover:bg-red-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      <AlertDialog open={showMatchWarning} onOpenChange={setShowMatchWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Low Match Score Warning</AlertDialogTitle>
            <AlertDialogDescription>
              Your profile has a match score of {matchScore}%, which is below the employer's minimum threshold of {job.match_threshold || 60}%. 
              While you can still apply, please note that your application might have a lower chance of being selected.
              Would you like to proceed with your application?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowMatchWarning(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowMatchWarning(false);
              setIsApplying(true);
            }}>
              Proceed Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobCardBack;
