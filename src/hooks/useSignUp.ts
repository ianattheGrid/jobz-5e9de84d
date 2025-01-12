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
      // First, try to get the session to check if user is already logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // User is logged in, try to add new role
        const { error: updateError } = await supabase.auth.updateUser({
          data: { user_type: userType }
        });

        if (updateError) {
          if (updateError.message.includes(`User already has the role ${userType}`)) {
            toast({
              variant: "destructive",
              title: "Role Already Exists",
              description: `You already have a ${userType} account. Please sign in instead.`,
            });
            navigate(`/${userType}/signin`);
            return;
          }
          throw updateError;
        }

        toast({
          title: "Success!",
          description: `${userType} role added to your account. Please sign in.`,
        });
        navigate(`/${userType}/signin`);
        return;
      }

      // User is not logged in, proceed with normal signup
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
        if (error.message.includes('already registered') || 
            error.message.includes('User already registered')) {
          // User exists but not logged in, try to sign in and add role
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (signInError) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Please sign in with your existing account first.",
            });
            navigate(`/${userType}/signin`);
            return;
          }

          // Now try to add the new role
          const { error: updateError } = await supabase.auth.updateUser({
            data: { user_type: userType }
          });

          if (updateError) {
            if (updateError.message.includes(`User already has the role ${userType}`)) {
              toast({
                variant: "destructive",
                title: "Role Already Exists",
                description: `You already have a ${userType} account. Please sign in instead.`,
              });
              navigate(`/${userType}/signin`);
              return;
            }
            throw updateError;
          }

          toast({
            title: "Success!",
            description: `${userType} role added to your account. Please sign in.`,
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
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { handleSignUp, loading };
};