import { useEffect } from 'react';
import { UseFormReset } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { CandidateFormValues } from '@/components/candidate/candidateFormSchema';
import { useToast } from '@/components/ui/use-toast';

export const useProfileData = (callback: (data: CandidateFormValues | null) => void) => {
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          console.log('No active session found');
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please sign in to access your profile.",
          });
          return;
        }

        const { data: profile, error } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading profile:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load your profile. Please try again later.",
          });
          return;
        }

        if (profile) {
          console.log('Loading existing profile:', profile);
          const formData: CandidateFormValues = {
            full_name: profile.full_name || '',
            email: profile.email || '',
            phone_number: profile.phone_number || '',
            address: profile.address || '',
            location: profile.location || 'Bristol',
            workArea: profile.job_title || '',
            min_salary: profile.min_salary || 0,
            max_salary: profile.max_salary || 0,
            required_skills: profile.required_skills || [],
            security_clearance: profile.security_clearance,
            work_eligibility: profile.work_eligibility,
            years_experience: profile.years_experience?.toString() || '',
            commission_percentage: profile.commission_percentage || null,
            open_to_commission: profile.commission_percentage !== null,
            additional_skills: profile.additional_skills || "",
            availability: profile.availability || "Immediate",
            work_preferences: profile.work_preferences || "",
            current_employer: profile.current_employer || "",
            travel_radius: profile.travel_radius || 10,
            job_seeking_reasons: [],
            other_job_seeking_reason: "",
            title: "",
            desired_job_title: "",
            desired_years_experience: "",
            wantsCareerChange: "",
            otherWorkArea: "",
            itSpecialization: "",
            view_scheme: false
          };
          callback(formData);
        } else {
          console.log('No existing profile found, using default values');
          callback(null);
        }
      } catch (error: any) {
        console.error('Error loading profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your profile. Please try again later.",
        });
      }
    };

    loadProfile();
  }, [callback, toast]);
};