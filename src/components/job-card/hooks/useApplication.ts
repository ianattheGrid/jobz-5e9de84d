import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMatchScore } from "./useMatchScore";
import { validateEssentialCriteria } from "../utils/applicationValidation";
import { generateMatchExplanation } from "../utils/matchExplanation";

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

      // Explicitly including title_experience property
      // Add title_experience at mapping time rather than trying to access it from profile
      const validProfile = {
        ...profile,
        title_experience: null, // Set default value since it's not in the database schema
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

  return {
    isApplying,
    setIsApplying, 
    coverLetter,
    setCoverLetter,
    resumeFile,
    setResumeFile,
    handleStartApply,
    handleSubmitApplication: async () => {
      if (!user) return;
      
      try {
        let resumeUrl = null;
        if (resumeFile) {
          const filePath = `${user.id}/applications/${jobId}/${Date.now()}-${resumeFile.name}`;
          const { error: uploadError } = await supabase.storage
            .from('cvs')
            .upload(filePath, resumeFile, { upsert: true });

          if (uploadError) {
            throw new Error(`Resume upload failed: ${uploadError.message}`);
          }

          resumeUrl = filePath;
        }

        // Get candidate profile and job details for match calculation
        const { data: profile } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const { data: job } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (!profile || !job) {
          throw new Error('Failed to load profile or job data');
        }

        // Calculate match score
        const { calculateTotalScore, titleMatch, specializationMatch, locationMatch, experienceMatch, salaryMatch } = useMatchScore(profile, job);
        const totalScore = await calculateTotalScore();
        const matchPercentage = Math.round(totalScore * 100);

        // Create detailed score breakdown
        const scoreBreakdown = {
          title: Math.round(titleMatch() * 100),
          specialization: Math.round(specializationMatch() * 100),
          location: Math.round(locationMatch() * 100),
          experience: Math.round(experienceMatch() * 100),
          salary: Math.round(salaryMatch() * 100),
          total: matchPercentage
        };

        // Generate match explanation
        const explanation = generateMatchExplanation(scoreBreakdown, job);
  
        const { data, error } = await supabase.from('applications').insert({
          job_id: jobId,
          applicant_id: user.id,
          cover_letter: coverLetter,
          resume_url: resumeUrl,
          status: 'pending',
          employer_accepted: false,
          candidate_accepted: false,
          match_percentage: matchPercentage,
          match_score_breakdown: scoreBreakdown,
          match_explanation: explanation
        }).select().single();
  
        if (error) throw error;
  
        setApplication(data);
        
        toast({
          title: "Application Submitted",
          description: `Your application has been submitted successfully! Match score: ${matchPercentage}%`,
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
    },
    matchWarningOpen,
    setMatchWarningOpen,
    matchWarningInfo,
    handleProceedWithApplication,
    application,
    applicationLoading,
    handleAccept
  };
};
