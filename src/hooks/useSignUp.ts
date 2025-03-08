
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signUp = async (email: string, password: string, userType: string, fullName: string, companyName: string) => {
    try {
      setLoading(true);
      
      // First create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('No user data returned');
      }

      // Then create the employer profile
      if (userType === 'employer') {
        const { error: profileError } = await supabase
          .from('employer_profiles')
          .insert({
            id: data.user.id,
            company_name: companyName,
            full_name: fullName,
            job_title: 'Not specified'
          });

        if (profileError) throw profileError;
      }

      toast({
        title: "Success!",
        description: "Account created successfully. Please sign in.",
      });
      
      navigate(`/${userType}/signin`);
      
    } catch (error: any) {
      const errorMessage = error.message?.toLowerCase().includes('already registered') 
        ? 'This email is already registered. Please sign in instead.'
        : 'An error occurred during sign up. Please try again.';

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });

      if (errorMessage.includes('already registered')) {
        navigate(`/${userType}/signin`);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signUp,
  };
};
