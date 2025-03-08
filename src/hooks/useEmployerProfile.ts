
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
    company_name: "",
    full_name: "",
    job_title: "",
  });

  const isProfileComplete = (profile: EmployerProfile) => {
    return profile.company_name.length > 0 &&
           profile.full_name.length > 0 &&
           profile.job_title.length > 0;
  };

  const checkProfileCompletion = () => {
    const currentPath = window.location.pathname;
    // Skip redirect if already on profile page
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
          company_name: data.company_name || "",
          full_name: data.full_name || "",
          job_title: data.job_title || "",
        });
      } else {
        // Create a new profile if none exists
        const { error: createError } = await supabase
          .from('employer_profiles')
          .insert([
            {
              id: userId,
              company_name: "",
              full_name: "",
              job_title: "",
            }
          ]);

        if (createError) throw createError;
        
        // Fetch the newly created profile
        const { data: newProfile, error: fetchError } = await supabase
          .from('employer_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (fetchError) throw fetchError;
        if (newProfile) {
          setProfile({
            company_name: newProfile.company_name || "",
            full_name: newProfile.full_name || "",
            job_title: newProfile.job_title || "",
          });
        }
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
