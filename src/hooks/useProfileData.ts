import { useEffect } from 'react';
import { UseFormReset } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { CandidateFormValues } from '@/components/candidate/candidateFormSchema';
import { useToast } from '@/components/ui/use-toast';

export const useProfileData = (reset: UseFormReset<CandidateFormValues>) => {
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
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Record not found - this is fine for new users
            console.log('No profile found for user');
            return;
          }
          throw error;
        }

        if (profile) {
          reset({
            full_name: profile.full_name || '',
            email: profile.email || '',
            phone_number: profile.phone_number || '',
            address: profile.address || '',
            location: profile.location || 'Bristol',
            workArea: profile.job_title || '',
            salary: profile.min_salary && profile.max_salary ? 
              `${profile.min_salary}-${profile.max_salary}` : '',
            required_skills: profile.required_skills || [],
            security_clearance: profile.security_clearance || undefined,
            work_eligibility: profile.work_eligibility || undefined,
            years_experience: profile.years_experience?.toString() || '',
            commission_percentage: profile.commission_percentage,
            open_to_commission: profile.commission_percentage !== null,
            preferred_work_type: profile.preferred_work_type || "office",
            additional_skills: profile.additional_skills || "",
            availability: profile.availability || "Immediate",
          });
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
  }, [reset, toast]);
};