
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError, AuthApiError } from '@supabase/supabase-js';

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string, intendedUserType?: string) => {
    try {
      setLoading(true);
      console.log('Starting sign in process...'); 

      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        let errorMessage = "An error occurred during sign in.";
        
        if (error.message?.includes('Email not confirmed')) {
          toast({
            variant: "destructive",
            title: "Email Not Verified",
            description: "Please check your email and verify your account before signing in.",
          });
          return;
        }

        if (error.message?.includes('Invalid login credentials')) {
          toast({
            variant: "destructive",
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect. Please check your credentials and try again.",
          });
          return;
        }

        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
        return;
      }

      if (!user) {
        throw new Error('No user returned after successful sign in');
      }

      // Check both user_metadata and identity_data for user type
      const userMetadataType = user.user_metadata?.user_type?.toLowerCase();
      const identityDataType = user.identities?.[0]?.identity_data?.user_type?.toLowerCase();
      const effectiveUserType = userMetadataType || identityDataType;

      console.log('User types found:', { userMetadataType, identityDataType, effectiveUserType });

      // Check if user is trying to sign in with the correct user type
      if (intendedUserType && effectiveUserType !== intendedUserType) {
        console.log('User type mismatch:', { intendedUserType, effectiveUserType });
        
        // Query the user_roles table to verify the role
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (!userRole || userRole.role !== intendedUserType) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: `This login is for ${intendedUserType} accounts only. Please use the correct login page.`,
          });
          return;
        }
      }

      // Get the user's role from the user_roles table
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!userRole) {
        console.error('No user role found');
        toast({
          variant: "destructive",
          title: "Error",
          description: "User role not found. Please contact support.",
        });
        return;
      }

      const role = userRole.role;
      console.log('User role from database:', role);

      // Redirect based on the role from the database
      switch(role) {
        case 'candidate':
          console.log('Redirecting to candidate dashboard');
          navigate('/candidate/dashboard', { replace: true });
          break;
        case 'employer':
          console.log('Redirecting to employer dashboard');
          navigate('/employer/dashboard', { replace: true });
          break;
        case 'vr':
          console.log('Redirecting to VR dashboard');
          navigate('/vr/dashboard', { replace: true });
          break;
        default:
          console.error('Invalid user type:', role);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Invalid user type. Please contact support.",
          });
          return;
      }

      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
      
    } catch (error: any) {
      console.error('Sign in error:', error); 
      let errorMessage = "An unexpected error occurred. Please try again later.";
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleSignIn, loading };
};
