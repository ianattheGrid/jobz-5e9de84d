
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
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const checkAuth = async () => {
      try {
        console.log(`[ProtectedRoute] Starting auth check for ${userType} at ${window.location.pathname}`);
        
        if (!isMounted) return;
        setLoading(true);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log(`[ProtectedRoute] Session result:`, { session: !!session, error: sessionError });
        
        if (!isMounted) return;
        
        if (sessionError) {
          console.error('[ProtectedRoute] Session error:', sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.log('[ProtectedRoute] No session found, redirecting to sign in');
          navigate(`/${userType}/signin`);
          return;
        }

        // Check user type from session metadata first (faster)
        const sessionUserType = session.user.user_metadata?.user_type;
        console.log(`[ProtectedRoute] Session user type: ${sessionUserType}, expected: ${userType}`);
        
        if (sessionUserType === userType) {
          console.log(`[ProtectedRoute] User type matches session metadata - authorized`);
          if (isMounted) {
            setAuthorized(true);
            setLoading(false);
          }
          return;
        }

        // Fallback: check database (with simplified query)
        console.log(`[ProtectedRoute] Checking user role in database`);
        const { data: userRoleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!isMounted) return;
        
        if (roleError) {
          console.error('[ProtectedRoute] Error fetching user role:', roleError);
          throw roleError;
        }
        
        if (!userRoleData || userRoleData.role !== userType) {
          console.log(`[ProtectedRoute] User type mismatch - redirecting to home`);
          navigate('/');
          return;
        }
        
        // User is authorized
        console.log(`[ProtectedRoute] Auth check passed - user authorized`);
        if (isMounted) {
          setAuthorized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('[ProtectedRoute] Error checking authentication:', error);
        if (isMounted) {
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please try refreshing the page or signing in again.",
          });
        }
      }
    };

    checkAuth();
    
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigate, userType]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};
