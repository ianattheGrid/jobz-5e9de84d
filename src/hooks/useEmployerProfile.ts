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

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
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
        if (newProfile) setProfile(newProfile);
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

  return { loading, profile, setProfile, email };
};