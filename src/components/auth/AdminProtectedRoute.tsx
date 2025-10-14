import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

console.log('[AdminProtectedRoute] Module loaded');

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  console.log('[AdminProtectedRoute] Component rendering...');
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');

  console.log('[AdminProtectedRoute] State:', { loading, isAdmin, error, debugInfo });

  useEffect(() => {
    console.log('[AdminProtectedRoute] useEffect triggered');
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkAdminStatus = async () => {
      try {
        console.log('[AdminProtectedRoute] Starting admin check...');
        setDebugInfo('Checking session...');
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('[AdminProtectedRoute] Session result:', { hasSession: !!session, sessionError });
        
        if (!isMounted) return;
        
        if (sessionError) {
          console.error('[AdminProtectedRoute] Session error:', sessionError);
          if (isMounted) {
            setError('Session error occurred');
            setDebugInfo('Session error: ' + sessionError.message);
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }
        
        if (!session) {
          console.log('[AdminProtectedRoute] No session - redirecting to signin');
          setDebugInfo('No session found - redirecting');
          navigate("/admin/signin", { replace: true });
          return;
        }

        const userEmail = session.user.email;
        console.log('[AdminProtectedRoute] Checking admin status for:', userEmail);
        setDebugInfo('Checking admin status for: ' + userEmail);
        
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('email')
          .eq('email', userEmail)
          .maybeSingle();

        if (!isMounted) return;

        if (adminError) {
          console.error('[AdminProtectedRoute] Admin check error:', adminError);
          if (isMounted) {
            setError('Error verifying admin status');
            setDebugInfo('Admin check error: ' + adminError.message);
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        const isAdminUser = !!adminData;
        console.log('[AdminProtectedRoute] Admin status:', isAdminUser, 'Data:', adminData);
        
        if (!isAdminUser) {
          console.log('[AdminProtectedRoute] Not admin - redirecting');
          setDebugInfo('User is not an admin - redirecting');
          navigate("/admin/signin", { replace: true });
          return;
        }

        console.log('[AdminProtectedRoute] Admin verified successfully!');
        if (isMounted) {
          setDebugInfo('Admin verified - rendering content');
          setIsAdmin(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('[AdminProtectedRoute] Exception:', error);
        if (isMounted) {
          setError('An unexpected error occurred: ' + (error instanceof Error ? error.message : String(error)));
          setDebugInfo('Exception: ' + (error instanceof Error ? error.message : String(error)));
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    // Set timeout fallback
    timeoutId = setTimeout(() => {
      console.error('[AdminProtectedRoute] Timeout - admin check taking too long');
      if (isMounted && loading) {
        setError('Admin verification timeout - please try again');
        setDebugInfo('Timeout after 10 seconds');
        setLoading(false);
      }
    }, 10000);

    console.log('[AdminProtectedRoute] Starting checkAdminStatus...');
    checkAdminStatus();

    return () => {
      console.log('[AdminProtectedRoute] Cleanup');
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate, loading]);

  console.log('[AdminProtectedRoute] Rendering decision - loading:', loading, 'error:', error, 'isAdmin:', isAdmin);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Verifying admin access...</p>
        <p className="text-xs text-muted-foreground mt-2">{debugInfo}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <p className="text-destructive mb-4">{error}</p>
        <button 
          onClick={() => navigate("/admin/signin")}
          className="text-primary hover:underline"
        >
          Return to Sign In
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    console.log('[AdminProtectedRoute] Not rendering - isAdmin is false');
    return null;
  }

  console.log('[AdminProtectedRoute] Rendering children');
  return <>{children}</>;
};
