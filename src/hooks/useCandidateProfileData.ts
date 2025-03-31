
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { VRRecommendation } from "@/types/recommendations";

export const useCandidateProfileData = (id: string | undefined) => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [vrRecommendation, setVrRecommendation] = useState<VRRecommendation | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.user_metadata.user_type !== 'employer') {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Only employers can view candidate profiles.",
        });
        navigate('/employer/signin');
        return;
      }
    };

    checkAuth();
  }, [navigate, toast]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          const validProfile: CandidateProfile = {
            id: data.id,
            email: data.email,
            job_title: data.job_title,
            years_experience: data.years_experience,
            location: data.location || [],
            min_salary: data.min_salary,
            max_salary: data.max_salary,
            required_qualifications: data.required_qualifications || [],
            required_skills: data.required_skills || null,
            security_clearance: data.security_clearance,
            commission_percentage: data.commission_percentage,
            created_at: data.created_at,
            updated_at: data.updated_at,
            signup_date: data.signup_date,
            work_eligibility: data.work_eligibility,
            preferred_work_type: data.preferred_work_type,
            availability: data.availability,
            additional_skills: data.additional_skills,
            address: data.address,
            ai_synopsis: data.ai_synopsis,
            ai_synopsis_last_updated: data.ai_synopsis_last_updated,
            ai_synopsis_status: data.ai_synopsis_status,
            current_employer: data.current_employer,
            cv_url: data.cv_url,
            full_name: data.full_name,
            phone_number: data.phone_number,
            profile_picture_url: data.profile_picture_url,
            travel_radius: data.travel_radius,
            work_preferences: data.work_preferences,
            desired_job_title: data.desired_job_title,
            home_postcode: data.home_postcode,
            linkedin_url: data.linkedin_url,
            years_in_current_title: data.years_in_current_title || null,
            workArea: data.workArea || null,
            itSpecialization: data.itSpecialization || null
          };
          setProfile(validProfile);
          
          // After getting the profile, check for VR recommendation
          await fetchVRRecommendation(data.email);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load candidate profile.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    // Helper function to fetch VR recommendation for the candidate
    const fetchVRRecommendation = async (candidateEmail: string) => {
      try {
        // First get recommendation data
        const { data: recommendationData, error: recommendationError } = await supabase
          .from('candidate_recommendations')
          .select(`
            id, 
            created_at, 
            status,
            vr_id
          `)
          .eq('candidate_email', candidateEmail)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (recommendationError || !recommendationData) {
          return;
        }

        // Then fetch VR profile data separately
        const { data: vrData, error: vrError } = await supabase
          .from('virtual_recruiter_profiles')
          .select('id, full_name, vr_number')
          .eq('id', recommendationData.vr_id)
          .single();

        if (vrError || !vrData) {
          console.error('Error fetching VR profile:', vrError);
          return;
        }
        
        const recommendation: VRRecommendation = {
          id: recommendationData.id,
          recommendationDate: recommendationData.created_at,
          status: recommendationData.status,
          vr: {
            id: vrData.id,
            name: vrData.full_name,
            vrNumber: vrData.vr_number
          }
        };
        setVrRecommendation(recommendation);
      } catch (error) {
        console.error('Error fetching VR recommendation:', error);
      }
    };

    fetchProfile();
  }, [id, toast]);

  return { profile, loading, vrRecommendation };
};
