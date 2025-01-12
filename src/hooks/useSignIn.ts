import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    console.log('Starting sign in process...'); // Debug log

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in response:', { data, error }); // Debug log

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

      // Get the user type from metadata
      const userType = data.user.user_metadata?.user_type;
      console.log('User metadata:', data.user.user_metadata); // Debug log
      console.log('Detected user type:', userType); // Debug log

      if (!userType) {
        console.error('No user type found in metadata');
        toast({
          variant: "destructive",
          title: "Error",
          description: "User type not found. Please contact support.",
        });
        return;
      }

      // Redirect based on user type
      let redirectPath = '';
      switch(userType) {
        case 'candidate':
          console.log('User is a candidate, redirecting to candidate dashboard'); // Debug log
          redirectPath = '/candidate/dashboard';
          break;
        case 'employer':
          console.log('User is an employer, redirecting to employer dashboard'); // Debug log
          redirectPath = '/employer/dashboard';
          break;
        case 'vr':
          console.log('User is a VR, redirecting to VR dashboard'); // Debug log
          redirectPath = '/vr/dashboard';
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

      console.log('Navigating to:', redirectPath); // Debug log
      navigate(redirectPath);

      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
      
    } catch (error: any) {
      console.error('Sign in error:', error); // Debug log
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