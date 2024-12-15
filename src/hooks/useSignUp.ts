import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSignUp = () => {
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
            user_type: 'candidate'
          },
          emailRedirectTo: `${window.location.origin}/candidate/signin`
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            variant: "destructive",
            title: "Account Already Exists",
            description: "This email is already registered. Please sign in instead.",
          });
          navigate('/candidate/signin');
          return;
        }
        throw error;
      }

      toast({
        title: "Verification email sent!",
        description: "Please check your email to verify your account before signing in.",
      });
      
      navigate('/candidate/signin');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleSignUp, loading };
};