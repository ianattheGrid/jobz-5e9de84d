import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSignUp = (userType: 'candidate' | 'employer' | 'vr') => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType
          },
          emailRedirectTo: `${window.location.origin}/${userType}/signin`
        }
      });

      if (error) {
        if (
          error.message.includes('already registered') || 
          error.message.includes('User already registered') ||
          error.message.includes(`User already has the role ${userType}`)
        ) {
          toast({
            variant: "destructive",
            title: "Account Already Exists",
            description: "This email is already registered for this role. Please sign in instead.",
          });
          navigate(`/${userType}/signin`);
          return;
        }
        throw error;
      }

      toast({
        title: "Verification email sent!",
        description: "Please check your email to verify your account before signing in.",
      });
      
      navigate(`/${userType}/signin`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error; // Re-throw the error so the form component can handle it
    } finally {
      setLoading(false);
    }
  };

  return { handleSignUp, loading };
};