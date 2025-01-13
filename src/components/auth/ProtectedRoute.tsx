import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: string[];
}

export const ProtectedRoute = ({ children, allowedUserTypes = ['employer', 'candidate', 'vr'] }: ProtectedRouteProps) => {
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

      const userType = session.user.user_metadata.user_type?.toLowerCase();
      
      if (!allowedUserTypes.includes(userType)) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this page.",
        });
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate, allowedUserTypes, toast]);

  return <>{children}</>;
};