
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  createEmployerProfile, 
  createCandidateProfile, 
  createVRProfile, 
  createUserRole 
} from "@/utils/profile-creation";
import { processReferralCode } from "@/utils/referral/processReferralCode";
import { signUpWithEmail } from "@/utils/auth/signUpWithEmail";

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signUp = async (
    email: string, 
    password: string, 
    userType: string, 
    fullName: string,
    jobTitle: string | Record<string, any> = '',
    companyName: string = '', 
    companyWebsite: string = '',
    companySize: number = 0
  ) => {
    try {
      setLoading(true);
      console.log(`Starting sign up for ${email} as ${userType}`);

      // Extract referral code if passed in jobTitle parameter (temporary solution)
      let referralCode: string | undefined;
      let actualJobTitle = '';
      
      if (userType === 'candidate' && typeof jobTitle === 'object' && jobTitle !== null && 'referralCode' in jobTitle) {
        referralCode = (jobTitle as any).referralCode;
      } else if (jobTitle && typeof jobTitle === 'string') {
        actualJobTitle = jobTitle;
      }

      const { data, error } = await signUpWithEmail({
        email,
        password,
        userType,
        fullName,
        referralCode
      });

      if (error) {
        const isAlreadyRegistered = error.message.toLowerCase().includes('already registered');
        toast({
          variant: "destructive",
          title: "Error",
          description: isAlreadyRegistered 
            ? 'This email is already registered. Please sign in instead.'
            : error.message,
        });

        if (isAlreadyRegistered) {
          navigate(`/${userType}/signin`);
        }
        return;
      }

      if (!data.user) {
        throw new Error('No user data returned');
      }

      console.log(`User created successfully. Creating user role...`);
      
      // Create user role first, then create profile
      try {
        await createUserRole(data.user.id, userType);
        console.log(`User role created. Creating ${userType} profile...`);
        
        // Create profile based on user type
        if (userType === 'employer') {
          await createEmployerProfile(data.user.id, companyName, fullName, companyWebsite, companySize);
        } else if (userType === 'candidate') {
          await createCandidateProfile(data.user.id, fullName, email);
          
          // If there's a referral code, process it
          if (referralCode) {
            await processReferralCode(referralCode, data.user.id, email);
          }
        } else if (userType === 'vr') {
          await createVRProfile(data.user.id, fullName, email);
        }
        
        console.log(`${userType} profile created. Attempting to sign in...`);
        
        // Auto sign in after successful account creation
        await signInNewUser(email, password);

        toast({
          title: "Success!",
          description: "Account created successfully. Welcome!",
        });
        
        navigate(`/${userType}/dashboard`);
      } catch (setupError: any) {
        handleSetupError(setupError, email, password, userType);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'An error occurred during sign up. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const signInNewUser = async (email: string, password: string) => {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) throw signInError;
  };

  const handleSetupError = async (setupError: any, email: string, password: string, userType: string) => {
    console.error('Setup error:', setupError);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Account created but setup failed. Please contact support or try signing in.",
    });
    
    // Try to sign in anyway since the account was created
    try {
      await supabase.auth.signInWithPassword({
        email,
        password
      });
      navigate(`/${userType}/dashboard`);
    } catch (signInErr) {
      console.error('Failed to sign in after setup error:', signInErr);
      navigate(`/${userType}/signin`);
    }
  };

  return {
    loading,
    signUp,
  };
};
