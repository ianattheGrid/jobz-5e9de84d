import { searchFormSchema } from "@/components/candidate-search/searchFormSchema";
import { supabase } from "@/integrations/supabase/client";
import type { z } from "zod";
import { useSalaryFilter } from "./search/useSalaryFilter";
import { useSignupDateFilter } from "./search/useSignupDateFilter";
import { useSearchState } from "./search/useSearchState";

export const useCandidateSearch = () => {
  const { buildSalaryQuery } = useSalaryFilter();
  const { buildSignupDateQuery } = useSignupDateFilter();
  const { candidates, handleSearchError, handleSearchSuccess } = useSearchState();

  const searchCandidates = async (values: z.infer<typeof searchFormSchema>) => {
    try {
      const [minSalary, maxSalary] = values.salary.split(" - ").map(s => 
        parseInt(s.replace(/[£,]/g, ""))
      );

      let query = supabase
        .from('candidate_profiles')
        .select('*');

      query = buildSalaryQuery(query, minSalary, maxSalary);

      if (values.includeCommissionCandidates) {
        query = query.not('commission_percentage', 'is', null);
      }

      if (values.requiresQualification && values.qualificationRequired) {
        query = query.ilike('qualificationDetails', `%${values.qualificationRequired}%`);
      }

      if (values.required_skills && values.required_skills.length > 0) {
        query = query.contains('required_skills', values.required_skills);
      }

      if (values.requiresSecurityClearance && values.securityClearanceLevel) {
        query = query.eq('security_clearance', values.securityClearanceLevel);
      }

      if (values.signupPeriod) {
        query = buildSignupDateQuery(query, values.signupPeriod);
      }

      const { data: candidateProfiles, error } = await query;

      if (error) throw error;

      const validCandidateProfiles = candidateProfiles.map(profileData => ({
        id: profileData.id,
        email: profileData.email,
        job_title: profileData.job_title,
        years_experience: profileData.years_experience,
        location: profileData.location || [],
        min_salary: profileData.min_salary,
        max_salary: profileData.max_salary,
        required_qualifications: profileData.required_qualifications || [],
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
        linkedin_url: profileData.linkedin_url,
        years_in_current_title: profileData.years_in_current_title || null
      }));

      handleSearchSuccess(validCandidateProfiles);
    } catch (error: any) {
      handleSearchError();
    }
  };

  return { candidates, searchCandidates };
};
