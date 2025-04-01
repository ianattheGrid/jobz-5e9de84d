
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMatchScore } from "./useMatchScore";
import { validateEssentialCriteria } from "../utils/applicationValidation";

export const useApplication = (jobId: number, employerId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [matchWarningOpen, setMatchWarningOpen] = useState(false);
  const [matchWarningInfo, setMatchWarningInfo] = useState<any>(null);

  const handleMatchWarning = (matchInfo: any) => {
    setMatchWarningInfo(matchInfo);
    setMatchWarningOpen(true);
  };

  const handleProceedWithApplication = () => {
    setMatchWarningOpen(false);
    setIsApplying(true);
  };

  const handleStartApply = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for jobs",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the candidate profile
      const { data: profile, error: profileError } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        toast({
          title: "Profile required",
          description: "Please complete your profile before applying",
          variant: "destructive",
        });
        return;
      }

      // Get the job details
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError || !job) {
        toast({
          title: "Error",
          description: "Failed to load job details",
          variant: "destructive",
        });
        return;
      }

      // Check for existing applications
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id, status')
        .eq('job_id', jobId)
        .eq('applicant_id', user.id)
        .maybeSingle();

      if (existingApplication) {
        toast({
          title: "Already applied",
          description: `You have already applied to this position (Status: ${existingApplication.status})`,
          variant: "destructive",
        });
        return;
      }

      // Check if candidate works for the employer
      if (profile.current_employer?.toLowerCase() === job.company.toLowerCase()) {
        toast({
          variant: "destructive",
          title: "Application blocked",
          description: "You cannot apply to positions at your current employer",
        });
        return;
      }

      // Validate essential criteria
      const { isValid: meetsEssentialCriteria, failedCriteria } = validateEssentialCriteria(job, profile);
      
      // Calculate match score
      const { calculateTotalScore } = useMatchScore(profile, job);
      const totalScore = await calculateTotalScore();
      
      // Calculate minimum allowed score with 10% leeway
      const minimumAllowedScore = Math.max(0, job.match_threshold - 10);
      
      // Check if score is too low (outside the 10% leeway)
      const scorePercentage = Math.round(totalScore * 100);
      const isTooLowScore = scorePercentage < minimumAllowedScore;
      
      // Show warning if essential criteria not met or score is too low
      if (!meetsEssentialCriteria || scorePercentage < job.match_threshold || isTooLowScore) {
        handleMatchWarning({
          isEssentialMismatch: !meetsEssentialCriteria,
          totalScore: scorePercentage,
          failedCriteria,
          matchThreshold: job.match_threshold,
        });
        
        // Block application completely if essential criteria not met or score is too low (outside leeway)
        if (!meetsEssentialCriteria || isTooLowScore) {
          return;
        }
      } else {
        // No issues, proceed with application
        setIsApplying(true);
      }
    } catch (error: any) {
      console.error("Error in handleStartApply:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleSubmitApplication = async () => {
    if (!user) return;
    
    try {
      // Process resume upload if provided
      let resumeUrl = null;
      if (resumeFile) {
        const filePath = `resumes/${user.id}/${jobId}/${resumeFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('candidate-files')
          .upload(filePath, resumeFile);

        if (uploadError) {
          throw new Error(`Resume upload failed: ${uploadError.message}`);
        }

        resumeUrl = filePath;
      }

      // Insert application
      const { error } = await supabase.from('applications').insert({
        job_id: jobId,
        applicant_id: user.id,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
        status: 'pending',
        employer_accepted: false,
        candidate_accepted: false,
      });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });

      setIsApplying(false);
      setCoverLetter("");
      setResumeFile(null);
    } catch (error: any) {
      console.error("Application error:", error);
      toast({
        variant: "destructive",
        title: "Application Failed",
        description: error.message || "Failed to submit application",
      });
    }
  };

  return {
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
  };
};
