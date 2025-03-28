
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string, intendedUserType?: string) => {
    try {
      setLoading(true);
      console.log('Starting sign in process for:', email); 

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          variant: "destructive",
          title: "Invalid Credentials",
          description: "The email or password you entered is incorrect. Please check your credentials and try again.",
        });
        return;
      }

      if (!data.user) {
        throw new Error('No user returned after successful sign in');
      }

      console.log('Successfully signed in, fetching user role');

      // Get the user's role from the user_roles table
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not verify user role. Please try again.",
        });
        return;
      }

      if (!userRole) {
        console.error('No user role found for user:', data.user.id);
        toast({
          variant: "destructive",
          title: "Error",
          description: "User role not found. Please contact support.",
        });
        return;
      }

      console.log('User role found:', userRole);

      // If there's an intended user type, verify it matches
      if (intendedUserType && userRole.role !== intendedUserType) {
        console.error('Role mismatch:', { intended: intendedUserType, actual: userRole.role });
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: `This login is for ${intendedUserType} accounts only. Please use the correct login page.`,
        });
        return;
      }

      // Check if the profile exists for the user type
      if (userRole.role === 'vr') {
        const { data: vrProfile, error: profileError } = await supabase
          .from('virtual_recruiter_profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError || !vrProfile) {
          console.error('VR profile not found:', profileError);
          
          // Try to create a profile based on user metadata
          try {
            const { error: createError } = await supabase
              .from('virtual_recruiter_profiles')
              .insert({
                id: data.user.id,
                full_name: data.user.user_metadata.full_name || 'New User',
                email: data.user.email || '',
                location: '',
                bank_account_verified: false
              });
              
            if (createError) {
              console.error('Failed to create VR profile on login:', createError);
              toast({
                variant: "destructive",
                title: "Profile Error",
                description: "Your profile could not be found or created. Please contact support.",
              });
              return;
            }
            
            console.log('Created missing VR profile during sign in');
          } catch (err) {
            console.error('Error during profile recovery:', err);
            toast({
              variant: "destructive",
              title: "Profile Error",
              description: "Your profile could not be found or created. Please contact support.",
            });
            return;
          }
        }
      }

      // Redirect based on the role from the database
      const redirectPath = `/${userRole.role}/dashboard`;
      console.log('Redirecting to:', redirectPath);
      
      navigate(redirectPath, { replace: true });

      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleSignIn, loading };
};
