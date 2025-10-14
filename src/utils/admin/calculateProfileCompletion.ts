import { CandidateProfile, EmployerProfile, VirtualRecruiterProfile } from "@/integrations/supabase/types/profiles";

export const calculateCandidateCompletion = (profile: CandidateProfile): number => {
  const keyFields = [
    profile.full_name,
    profile.email,
    profile.phone_number,
    profile.job_title,
    profile.years_experience !== null && profile.years_experience !== undefined,
    profile.location && profile.location.length > 0,
    profile.home_postcode,
    profile.min_salary,
    profile.max_salary,
    profile.required_skills && profile.required_skills.length > 0,
    profile.required_qualifications && profile.required_qualifications.length > 0,
    profile.cv_url,
    profile.linkedin_url,
    profile.availability,
    profile.work_eligibility,
    profile.ai_synopsis,
  ];

  const completed = keyFields.filter(Boolean).length;
  return Math.round((completed / keyFields.length) * 100);
};

export const calculateEmployerCompletion = (profile: EmployerProfile): number => {
  const keyFields = [
    profile.full_name,
    profile.job_title,
    profile.company_name,
    profile.company_website,
    profile.company_logo_url,
    profile.linkedin_url,
    profile.profile_picture_url,
  ];

  const completed = keyFields.filter(Boolean).length;
  return Math.round((completed / keyFields.length) * 100);
};

export const calculateVRCompletion = (profile: VirtualRecruiterProfile): number => {
  const keyFields = [
    profile.full_name,
    profile.email,
    profile.vr_number,
    profile.location,
    profile.bank_account_verified,
    profile.national_insurance_number,
  ];

  const completed = keyFields.filter(Boolean).length;
  return Math.round((completed / keyFields.length) * 100);
};
