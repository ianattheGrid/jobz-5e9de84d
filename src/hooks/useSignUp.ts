
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signUp = async (email: string, password: string, userType: string, fullName: string, companyName: string) => {
    setLoading(true);
    console.log('Starting signup process for:', email, userType);

    try {
      // Attempt to sign up
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
            email,
            company_name: companyName,
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      if (!user) {
        throw new Error('No user data returned after signup');
      }

      console.log('Signup successful, user data:', user);

      // Wait for user creation and role assignment
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (userType === 'employer') {
        const { error: profileError } = await supabase
          .from('employer_profiles')
          .insert({
            id: user.id,
            company_name: companyName,
            full_name: fullName,
            job_title: 'Not specified'
          });

        if (profileError) {
          console.error('Error creating employer profile:', profileError);
          throw profileError;
        }
      }

      toast({
        title: "Success!",
        description: "Account created successfully. Please sign in.",
      });
      
      navigate(`/${userType}/signin`);
      
    } catch (error: any) {
      console.error('Signup process error:', error);
      
      let errorMessage = 'An unexpected error occurred during sign up';
      
      if (error.message?.includes('User already registered') || 
          error.message?.includes('already exists') ||
          error.message?.includes('duplicate key value')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.message?.includes('invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
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
