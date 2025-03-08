
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const createEmployerProfile = async (userId: string, companyName: string, fullName: string) => {
  const { error } = await supabase
    .from('employer_profiles')
    .insert({
      id: userId,
      company_name: companyName,
      full_name: fullName,
      job_title: 'Not specified'
    });

  if (error) throw error;
};

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signUp = async (email: string, password: string, userType: string, fullName: string, companyName: string) => {
    try {
      setLoading(true);

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

      if (error) {
        const isAlreadyRegistered = error.message.toLowerCase().includes('already registered');
        toast({
          variant: "destructive",
          title: "Error",
          description: isAlreadyRegistered 
            ? 'This email is already registered. Please sign in instead.'
            : error.message,
        });

        if (isAlreadyRegistered) {
          navigate(`/${userType}/signin`);
        }
        return;
      }

      if (!data.user) {
        throw new Error('No user data returned');
      }

      if (userType === 'employer') {
        await createEmployerProfile(data.user.id, companyName, fullName);
      }

      toast({
        title: "Success!",
        description: "Account created successfully. Please sign in.",
      });
      
      navigate(`/${userType}/signin`);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'An error occurred during sign up. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signUp,
  };
};
