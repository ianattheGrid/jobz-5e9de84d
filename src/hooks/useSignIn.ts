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
    setLoading(true);
    console.log('Starting sign in process...'); 

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in response:', { data, error }); 

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast({
            variant: "destructive",
            title: "Email Not Verified",
            description: "Please check your email and verify your account before signing in.",
          });
          return;
        }
        throw error;
      }

      if (!data?.user) {
        throw new Error('No user returned after successful sign in');
      }

      const userMetadata = data.user.user_metadata;
      console.log('User metadata:', userMetadata); 

      const userType = userMetadata?.user_type?.toLowerCase();
      console.log('Detected user type:', userType); 

      // Check if user is trying to sign in with the correct user type
      if (intendedUserType && userType !== intendedUserType) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: `This login is for ${intendedUserType} accounts only. Please use the correct login page.`,
        });
        setLoading(false);
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
        case 'recruiter':
          console.log('Redirecting to recruiter dashboard');
          navigate('/recruiter/dashboard', { replace: true });
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
      let errorMessage = "An error occurred during sign in.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
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

  return { handleSignIn, loading };
};