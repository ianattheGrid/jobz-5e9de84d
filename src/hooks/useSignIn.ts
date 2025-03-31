
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmail } from "@/utils/auth/signInWithEmail";
import { fetchUserRole } from "@/utils/auth/fetchUserRole";
import { fetchUserProfile } from "@/utils/auth/fetchUserProfile";
import { signOut } from "@/utils/auth/signOut";

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string, intendedUserType?: string) => {
    try {
      setLoading(true);
      console.log('Starting sign in process for:', email, 'as', intendedUserType || 'any user type'); 

      // Authenticate the user
      const { data, error } = await signInWithEmail(email, password);

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

      // Get the user's role
      const userRole = await fetchUserRole(data.user.id);

      if (!userRole) {
        console.error('No user role found for user:', data.user.id);
        toast({
          variant: "destructive",
          title: "Account Error",
          description: "User role not found. Please contact support.",
        });
        return;
      }

      console.log('User role found:', userRole);

      // If there's an intended user type, verify it matches
      if (intendedUserType && userRole.role !== intendedUserType) {
        console.error('Role mismatch:', { intended: intendedUserType, actual: userRole.role });
        
        // Sign the user out since they tried to access the wrong portal
        await signOut();
        
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: `This login is for ${intendedUserType} accounts only. Please use the correct login page.`,
        });
        return;
      }

      // Verify that the profile exists
      const profile = await fetchUserProfile(data.user.id, userRole.role);
      
      if (!profile) {
        console.warn(`No ${userRole.role} profile found for user ${data.user.id}, redirecting to create profile`);
        
        // Redirect to profile creation based on role
        navigate(`/${userRole.role}/profile`, { replace: true });
        
        toast({
          title: "Welcome!",
          description: "Please complete your profile to continue.",
        });
        
        return;
      }

      // Redirect based on the role from the database
      const redirectPath = `/${userRole.role}/dashboard`;
      console.log('Redirecting to:', redirectPath);
      
      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
      
      navigate(redirectPath, { replace: true });
      
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
