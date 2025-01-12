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

        // If this is a VR signup, create the VR profile
        if (userType === 'vr') {
          const { error: profileError } = await supabase
            .from('virtual_recruiter_profiles')
            .insert({
              id: session.user.id,
              full_name: fullName,
              email: email,
              location: 'UK', // Default value
            });

          if (profileError) {
            console.error('Error creating VR profile:', profileError);
            throw profileError;
          }
        }

        toast({
          title: "Success!",
          description: `${userType} role added to your account. Please sign in.`,
        });
        navigate(`/${userType}/signin`);
        return;
      }

      // User is not logged in, proceed with normal signup
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
        if (error.message.includes('already registered') || 
            error.message.includes('User already registered')) {
          // User exists but not logged in, try to sign in and add role
          const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
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

          // If this is a VR signup, create the VR profile
          if (userType === 'vr' && signInData.user) {
            const { error: profileError } = await supabase
              .from('virtual_recruiter_profiles')
              .insert({
                id: signInData.user.id,
                full_name: fullName,
                email: email,
                location: 'UK', // Default value
              });

            if (profileError) {
              console.error('Error creating VR profile:', profileError);
              throw profileError;
            }
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

      // If this is a new VR signup, create the VR profile
      if (userType === 'vr' && data.user) {
        const { error: profileError } = await supabase
          .from('virtual_recruiter_profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            email: email,
            location: 'UK', // Default value
          });

        if (profileError) {
          console.error('Error creating VR profile:', profileError);
          throw profileError;
        }
      }

      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
      navigate(`/${userType}/signin`);
    } catch (error: any) {
      console.error('Signup error:', error);
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

  return {
    loading,
    signUp,
  };
};