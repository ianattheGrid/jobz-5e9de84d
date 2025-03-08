
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
      // First try to sign up the user
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

      // Wait to ensure the user is fully created
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify the user creation by attempting to get the user's role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError) {
        console.error('Error checking user role:', roleError);
        throw new Error('Could not verify user role creation. Please try signing in.');
      }

      console.log('User role verified:', roleData);

      // Create employer profile if it's an employer
      if (userType === 'employer') {
        try {
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
            // Don't throw here, just log the error as the user is already created
          } else {
            console.log('Employer profile created successfully');
          }
        } catch (err) {
          console.error('Error in employer profile creation:', err);
        }
      }

      toast({
        title: "Success!",
        description: "Account created successfully. Please sign in.",
      });
      
      // Navigate to the appropriate sign in page
      navigate(`/${userType}/signin`);
      
    } catch (error: any) {
      console.error('Signup process error:', error);
      
      // Handle specific error cases
      let errorMessage = 'An unexpected error occurred during sign up';
      
      if (error.message?.includes('already registered')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.message?.includes('Database error')) {
        errorMessage = 'Error creating account. Please try again in a few moments.';
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
