import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import JobDetails from "./details/JobDetails";
import CommissionDetails from "./details/CommissionDetails";
import ApplicationSection from "./application/ApplicationSection";
import { useAuthenticationCheck, useProfileCheck } from "./utils/authChecks";
import { JobCardBackProps } from "./types";
import ApplicationStatus from "./application/ApplicationStatus";
import { useApplication } from "./hooks/useApplication";
import { validateEssentialCriteria } from "./utils/applicationValidation";
import { X } from "lucide-react";
import { useEmployerValidation } from "@/hooks/useEmployerValidation";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";

const JobCardBack = ({ job, onClose }: JobCardBackProps) => {
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  
  const checkAuthentication = useAuthenticationCheck();
  const checkProfile = async (userId: string) => {
    const { data: profileData, error } = await supabase
      .from('candidate_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch profile"
      });
      return null;
    }

    const profile: CandidateProfile = {
      id: profileData.id,
      email: profileData.email,
      job_title: profileData.job_title,
      years_experience: profileData.years_experience,
      location: profileData.location || [],
      min_salary: profileData.min_salary,
      max_salary: profileData.max_salary,
      required_qualifications: profileData.required_qualifications || null,
      required_skills: profileData.required_skills || null,
      security_clearance: profileData.security_clearance,
      commission_percentage: profileData.commission_percentage,
      created_at: profileData.created_at,
      updated_at: profileData.updated_at,
      signup_date: profileData.signup_date,
      work_eligibility: profileData.work_eligibility,
      preferred_work_type: profileData.preferred_work_type,
      availability: profileData.availability,
      additional_skills: profileData.additional_skills,
      address: profileData.address,
      ai_synopsis: profileData.ai_synopsis,
      ai_synopsis_last_updated: profileData.ai_synopsis_last_updated,
      ai_synopsis_status: profileData.ai_synopsis_status,
      current_employer: profileData.current_employer,
      cv_url: profileData.cv_url,
      full_name: profileData.full_name,
      phone_number: profileData.phone_number,
      profile_picture_url: profileData.profile_picture_url,
      travel_radius: profileData.travel_radius,
      work_preferences: profileData.work_preferences,
      desired_job_title: profileData.desired_job_title,
      home_postcode: profileData.home_postcode,
      linkedin_url: profileData.linkedin_url
    };

    return profile;
  };
  
  const { application, handleAccept } = useApplication(job);

  const { validateEmployerApplication } = useEmployerValidation();

  const handleStartApply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const session = await checkAuthentication();
    if (!session) return;

    const profile = await checkProfile(session.user.id);
    if (!profile) return;

    const { isValid, failedCriteria } = validateEssentialCriteria(job, profile);
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Cannot Apply",
        description: (
          <div className="space-y-2">
            <p>You don't meet the following essential criteria:</p>
            <ul className="list-disc pl-4">
              {failedCriteria.map((criteria, index) => (
                <li key={index}>{criteria}</li>
              ))}
            </ul>
          </div>
        )
      });
      return;
    }

    const canApply = await validateEmployerApplication(profile.current_employer, job.company);
    if (!canApply) return;
    
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
      className="h-full p-6 bg-[#2A2A2A] text-foreground overflow-y-auto rounded-lg"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {job.candidate_commission && (
          <CommissionDetails candidateCommission={job.candidate_commission} />
        )}

        <JobDetails job={job} />
        
        {application ? (
          <ApplicationStatus 
            status={application}
            onAccept={handleAccept}
            onChat={() => window.location.href = `/messages/${application.id}`}
          />
        ) : (
          <ApplicationSection
            jobId={job.id}
            employerId={job.employer_id || ''}
            onSubmit={handleSubmitApplication}
            setResumeFile={setResumeFile}
            setCoverLetter={setCoverLetter}
            coverLetter={coverLetter}
            onStartApply={handleStartApply}
            isApplying={isApplying}
            setIsApplying={setIsApplying}
          />
        )}
      </div>
    </div>
  );
};

export default JobCardBack;
