import { useEffect } from 'react';
import { UseFormReset } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { CandidateFormValues, WorkType } from '@/components/candidate/candidateFormSchema';

export const useProfileData = (reset: UseFormReset<CandidateFormValues>) => {
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: profile, error } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error);
          return;
        }

        if (profile) {
          reset({
            workArea: profile.job_title,
            location: [profile.location],
            salary: `${profile.min_salary}-${profile.max_salary}`,
            required_skills: profile.required_skills || [],
            security_clearance: profile.security_clearance,
            work_eligibility: profile.work_eligibility,
            years_experience: profile.years_experience.toString(),
            commission_percentage: profile.commission_percentage,
            open_to_commission: profile.commission_percentage !== null,
            preferred_work_type: (profile.preferred_work_type as WorkType) || "office",
            additional_skills: profile.additional_skills || "",
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [reset]);
};