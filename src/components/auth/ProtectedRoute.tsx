
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType: string;
}

export const ProtectedRoute = ({ children, userType }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Please sign in to access this page.",
        });
        navigate('/');
        return;
      }

      const currentUserType = session.user.user_metadata.user_type?.toLowerCase();
      
      if (currentUserType !== userType) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this page.",
        });
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate, userType, toast]);

  return <>{children}</>;
};
