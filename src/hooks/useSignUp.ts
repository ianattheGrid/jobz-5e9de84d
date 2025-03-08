
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
      // Sign out any existing session first
      await supabase.auth.signOut();
      
      // Try to get user by email first
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (existingUser?.user) {
        toast({
          variant: "destructive",
          title: "Account exists",
          description: "This email is already registered. Please sign in instead.",
        });
        navigate(`/${userType}/signin`);
        return;
      }

      // If no existing user, proceed with signup
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

      // Create employer profile if needed
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
      
      if (error.message?.toLowerCase().includes('already registered') || 
          error.message?.toLowerCase().includes('already exists') ||
          error.message?.toLowerCase().includes('duplicate key value')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
        navigate('/employer/signin');
      } else if (error.message?.toLowerCase().includes('invalid email')) {
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
