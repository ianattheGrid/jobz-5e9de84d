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

        // Handle database schema error specifically
        if (error.message?.includes('Database error querying schema')) {
          toast({
            variant: "destructive",
            title: "System Error",
            description: "There was a problem connecting to the database. Please try again in a few minutes or contact support if the problem persists.",
          });
          return;
        }

        // Handle invalid credentials
        if (error.message?.includes('Invalid login credentials')) {
          toast({
            variant: "destructive",
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect. Please check your credentials and try again.",
          });
          return;
        }

        // Generic error handler
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

      const userType = user.user_metadata?.user_type?.toLowerCase();
      console.log('Detected user type:', userType); 

      // Check if user is trying to sign in with the correct user type
      if (intendedUserType && userType !== intendedUserType) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: `This login is for ${intendedUserType} accounts only. Please use the correct login page.`,
        });
        return;
      }

      if (!userType) {
        console.error('No user type found in metadata');
        toast({
          variant: "destructive",
          title: "Error",
          description: "User type not found. Please contact support.",
        });
        return;
      }

      // Immediately redirect based on user type
      switch(userType) {
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
          console.error('Invalid user type:', userType);
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