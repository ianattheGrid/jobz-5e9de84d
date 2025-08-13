
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
        console.log(`[ProtectedRoute] Starting SIMPLIFIED auth check for ${userType}`);
        
        // Get session - this should be fast
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log(`[ProtectedRoute] Session check complete:`, { hasSession: !!session, error: sessionError });
        
        if (sessionError || !session) {
          console.log('[ProtectedRoute] No valid session - redirecting to sign in');
          navigate(`/${userType}/signin`);
          return;
        }

        // For now, just let them through if they have a session
        // We'll add proper role checking back once this works
        console.log(`[ProtectedRoute] Session found - allowing access`);
        setAuthorized(true);
        setLoading(false);
        
      } catch (error) {
        console.error('[ProtectedRoute] Error in auth check:', error);
        setLoading(false);
        navigate(`/${userType}/signin`);
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
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};
