
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  try {
    // Direct SQL query with the function call to bypass type checking issues
    const { data, error } = await supabase.functions.invoke('create-vr-profile', {
      body: {
        userId,
        fullName,
        email
      }
    });
    
    if (error) {
      console.error('Error creating VR profile:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Exception creating VR profile:', err);
    throw err;
  }
};

const createUserRole = async (userId: string, role: string) => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role
      });

    if (error) {
      console.error('Error creating user role:', error);
      throw error;
    }
  } catch (err) {
    console.error('Exception creating user role:', err);
    throw err;
  }
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
      console.log(`Starting sign up for ${email} as ${userType}`);

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

      console.log(`User created successfully. Creating user role...`);
      
      // Create user role first
      try {
        await createUserRole(data.user.id, userType);
        console.log(`User role created. Creating ${userType} profile...`);
        
        // Then create profile based on user type
        if (userType === 'employer') {
          await createEmployerProfile(data.user.id, companyName, fullName, companyWebsite, companySize);
        } else if (userType === 'candidate') {
          await createCandidateProfile(data.user.id, fullName, email);
        } else if (userType === 'vr') {
          await createVRProfile(data.user.id, fullName, email);
        }
        
        console.log(`${userType} profile created. Attempting to sign in...`);
        
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
      } catch (setupError: any) {
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

  return {
    loading,
    signUp,
  };
};
