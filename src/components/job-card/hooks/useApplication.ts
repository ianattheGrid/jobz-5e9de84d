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
  const [application, setApplication] = useState<any>(null);
  const [applicationLoading, setApplicationLoading] = useState(true);

  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!user) {
        setApplicationLoading(false);
        return;
      }
      
      try {
        setApplicationLoading(true);
        const { data: existingApp, error } = await supabase
          .from('applications')
          .select('*')
          .eq('job_id', jobId)
          .eq('applicant_id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        setApplication(existingApp);
      } catch (error) {
        console.error("Error checking existing application:", error);
      } finally {
        setApplicationLoading(false);
      }
    };
    
    checkExistingApplication();
  }, [user, jobId]);

  const handleMatchWarning = (matchInfo: any) => {
    setMatchWarningInfo(matchInfo);
    setMatchWarningOpen(true);
  };

  const handleProceedWithApplication = () => {
    setMatchWarningOpen(false);
    setIsApplying(true);
  };

  const handleAccept = async () => {
    if (!application) return;
    
    try {
      const { error } = await supabase
        .from('applications')
        .update({ candidate_accepted: true })
        .eq('id', application.id);
        
      if (error) throw error;
      
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('id', application.id)
        .single();
        
      setApplication(data);
      
      toast({
        title: "Application accepted",
        description: "You've accepted this job match. You can now proceed with the interview process.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept application",
        variant: "destructive",
      });
    }
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

      if (profile.current_employer?.toLowerCase() === job.company.toLowerCase()) {
        toast({
          variant: "destructive",
          title: "Application blocked",
          description: "You cannot apply to positions at your current employer",
        });
        return;
      }

      const validProfile = {
        ...profile,
        title_experience: profile.title_experience || null,
        location: profile.location || [],
        required_qualifications: profile.required_qualifications || []
      };

      const { isValid: meetsEssentialCriteria, failedCriteria } = validateEssentialCriteria(job, validProfile);
      
      const { calculateTotalScore } = useMatchScore(validProfile, job);
      const totalScore = await calculateTotalScore();
      
      const minimumAllowedScore = Math.max(0, job.match_threshold - 10);
      
      const scorePercentage = Math.round(totalScore * 100);
      
      const isTooLowScore = scorePercentage < minimumAllowedScore;
      
      if (!meetsEssentialCriteria || scorePercentage < job.match_threshold || isTooLowScore) {
        handleMatchWarning({
          isEssentialMismatch: !meetsEssentialCriteria,
          totalScore: scorePercentage,
          failedCriteria,
          matchThreshold: job.match_threshold,
        });
        
        if (!meetsEssentialCriteria || isTooLowScore) {
          return;
        }
      } else {
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

      const { data, error } = await supabase.from('applications').insert({
        job_id: jobId,
        applicant_id: user.id,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
        status: 'pending',
        employer_accepted: false,
        candidate_accepted: false,
      }).select().single();

      if (error) throw error;

      setApplication(data);
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully! You'll be notified when the employer responds.",
        variant: "default",
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
    handleProceedWithApplication,
    application,
    applicationLoading,
    handleAccept
  };
};
