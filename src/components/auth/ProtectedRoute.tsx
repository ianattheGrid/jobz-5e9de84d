
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType: string;
}

export const ProtectedRoute = ({ children, userType }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No session found, redirecting to sign in');
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Please sign in to access this page.",
          });
          
          // Redirect to the appropriate sign-in page based on userType
          navigate(`/${userType}/signin`);
          return;
        }

        const currentUserType = session.user.user_metadata.user_type?.toLowerCase();
        
        if (currentUserType !== userType) {
          console.log(`User type mismatch: expected ${userType}, got ${currentUserType}`);
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: `This page is for ${userType} accounts only. Please sign in with the correct account type.`,
          });
          
          // Redirect to home page on type mismatch
          navigate('/');
          return;
        }
        
        // If we get here, the user is authorized
        setAuthorized(true);
      } catch (error) {
        console.error('Error checking authentication:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem verifying your credentials. Please try signing in again.",
        });
        navigate(`/${userType}/signin`);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, userType, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};
