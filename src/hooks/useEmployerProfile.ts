
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { EmployerProfile } from "@/types/employer";

export const useEmployerProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<EmployerProfile>({
    id: "",
    company_name: "",
    full_name: "",
    job_title: "",
    company_website: null,
    company_logo_url: null,
    profile_picture_url: null,
    company_size: null,
    company_description: null,
    office_amenities: null,
    nearby_amenities: null,
    industry_sector: null,
    company_address: null,
    company_postcode: null,
    remote_work_policy: "office_based",
    company_culture: null,
    company_values: null,
    is_sme: false,
  });

  const isProfileComplete = (profile: EmployerProfile) => {
    return profile.company_name.length > 0 &&
           profile.full_name.length > 0 &&
           profile.job_title.length > 0;
  };

  const checkProfileCompletion = () => {
    const currentPath = window.location.pathname;
    if (!isProfileComplete(profile) && 
        !currentPath.includes('/employer/profile') && 
        (currentPath.includes('/employer/create-vacancy') || 
         currentPath.includes('/employer/candidate-search'))) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile before accessing this feature.",
      });
      navigate('/employer/profile');
      return false;
    }
    return true;
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          id: userId,
          company_name: data.company_name || "",
          company_website: data.company_website,
          company_logo_url: data.company_logo_url,
          profile_picture_url: data.profile_picture_url,
          full_name: data.full_name || "",
          job_title: data.job_title || "",
          company_size: data.company_size,
          company_description: data.company_description,
          office_amenities: data.office_amenities,
          nearby_amenities: data.nearby_amenities,
          industry_sector: data.industry_sector,
          company_address: data.company_address,
          company_postcode: data.company_postcode,
          remote_work_policy: data.remote_work_policy,
          company_culture: data.company_culture,
          company_values: data.company_values,
          is_sme: data.is_sme,
        });
      } else {
        const { error: createError } = await supabase
          .from('employer_profiles')
          .insert([
            {
              id: userId,
              company_name: "",
              full_name: "",
              job_title: "",
              company_website: null,
              company_logo_url: null,
              profile_picture_url: null,
            }
          ]);

        if (createError) throw createError;
        
        setProfile({
          id: userId,
          company_name: "",
          full_name: "",
          job_title: "",
          company_website: null,
          company_logo_url: null,
          profile_picture_url: null,
          company_size: null,
          company_description: null,
          office_amenities: null,
          nearby_amenities: null,
          industry_sector: null,
          company_address: null,
          company_postcode: null,
          remote_work_policy: "office_based",
          company_culture: null,
          company_values: null,
          is_sme: false,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || session.user.user_metadata.user_type !== 'employer') {
          navigate('/employer/signin');
          return;
        }
        setEmail(session.user.email || "");
        await loadProfile(session.user.id);
      } catch (error) {
        console.error('Error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while checking authentication",
        });
      }
    };

    checkUser();
  }, [navigate, toast]);

  useEffect(() => {
    if (!loading) {
      checkProfileCompletion();
    }
  }, [profile, loading]);

  return { loading, profile, setProfile, email, isProfileComplete: () => isProfileComplete(profile) };
};
