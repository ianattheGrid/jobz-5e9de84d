
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
