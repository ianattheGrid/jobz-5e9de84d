
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
      const { data, error } = await supabase.auth.signUp({
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

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned after signup');
      }

      console.log('Signup successful, user data:', data.user);

      // Verify the user_roles entry was created
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (roleError) {
        console.error('Error checking user role:', roleError);
        throw new Error('Failed to verify user role creation');
      }

      console.log('User role verified:', roleData);

      // Create employer profile if it's an employer
      if (userType === 'employer') {
        const { error: profileError } = await supabase
          .from('employer_profiles')
          .insert({
            id: data.user.id,
            company_name: companyName,
            full_name: fullName,
            job_title: 'Not specified' // Default value
          });

        if (profileError) {
          console.error('Error creating employer profile:', profileError);
          throw new Error('Failed to create employer profile');
        }

        console.log('Employer profile created successfully');
      }

      // Wait a moment to ensure all database operations complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Signup process completed successfully');
      
      toast({
        title: "Success!",
        description: "Account created successfully. Please sign in.",
      });
      
      // Navigate to the appropriate sign in page
      navigate(`/${userType}/signin`);
      
    } catch (error: any) {
      console.error('Signup process error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred during sign up",
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
