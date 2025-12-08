
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
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`[ProtectedRoute] Auth state changed:`, { event, hasSession: !!session });
        
        if (!isMounted) return;
        
        if (event === 'SIGNED_OUT' || !session) {
          console.log('[ProtectedRoute] User signed out or no session - redirecting');
          setAuthorized(false);
          setLoading(false);
          navigate(`/${userType}/signin`);
        } else if (session) {
          console.log('[ProtectedRoute] Session valid - authorizing');
          setAuthorized(true);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    const checkAuth = async () => {
      try {
        console.log(`[ProtectedRoute] Checking session for ${userType}`);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log(`[ProtectedRoute] Session check:`, { hasSession: !!session, error: sessionError });
        
        if (!isMounted) return;
        
        if (sessionError || !session) {
          console.log('[ProtectedRoute] No valid session - redirecting to sign in');
          setAuthorized(false);
          setLoading(false);
          navigate(`/${userType}/signin`);
          return;
        }

        console.log(`[ProtectedRoute] Session found - allowing access`);
        setAuthorized(true);
        setLoading(false);
        
      } catch (error) {
        console.error('[ProtectedRoute] Error in auth check:', error);
        if (isMounted) {
          setLoading(false);
          navigate(`/${userType}/signin`);
        }
      }
    };

    checkAuth();
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
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
