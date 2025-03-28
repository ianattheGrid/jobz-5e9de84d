
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const createEmployerProfile = async (userId: string, companyName: string, fullName: string, companyWebsite: string, companySize: number) => {
  const { error } = await supabase
    .from('employer_profiles')
    .insert({
      id: userId,
      company_name: companyName,
      full_name: fullName,
      company_website: companyWebsite,
      company_size: companySize,
      is_sme: true,
      job_title: 'Not specified'
    });

  if (error) throw error;
};

const createCandidateProfile = async (userId: string, fullName: string, email: string) => {
  const { error } = await supabase
    .from('candidate_profiles')
    .insert({
      id: userId,
      full_name: fullName,
      email: email,
      job_title: 'Not specified',
      min_salary: 0,
      max_salary: 0,
      years_experience: 0
    });

  if (error) throw error;
};

const createVRProfile = async (userId: string, fullName: string, email: string) => {
  const { error } = await supabase
    .from('virtual_recruiter_profiles')
    .insert({
      id: userId,
      full_name: fullName,
      email: email,
      location: '',
      vr_number: 'VR' + Math.floor(10000 + Math.random() * 90000),
      bank_account_verified: false
    });

  if (error) throw error;
};

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signUp = async (
    email: string, 
    password: string, 
    userType: string, 
    fullName: string,
    jobTitle: string = '',
    companyName: string = '', 
    companyWebsite: string = '',
    companySize: number = 0
  ) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
            full_name: fullName,
          },
        },
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

      try {
        if (userType === 'employer') {
          await createEmployerProfile(data.user.id, companyName, fullName, companyWebsite, companySize);
        } else if (userType === 'candidate') {
          await createCandidateProfile(data.user.id, fullName, email);
        } else if (userType === 'vr') {
          await createVRProfile(data.user.id, fullName, email);
        }
        
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;

        toast({
          title: "Success!",
          description: "Account created successfully. Welcome!",
        });
        
        navigate(`/${userType}/dashboard`);
      } catch (profileError: any) {
        console.error('Profile creation error:', profileError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Account created but profile setup failed. Please contact support.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'An error occurred during sign up. Please try again.',
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
