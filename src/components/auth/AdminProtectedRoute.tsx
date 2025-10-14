import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAdminStatus = async () => {
      try {
        console.log('[AdminProtectedRoute] Starting admin check...');
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (sessionError) {
          console.error('[AdminProtectedRoute] Session error:', sessionError);
          setError('Session error occurred');
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        if (!session) {
          console.log('[AdminProtectedRoute] No session - redirecting to signin');
          navigate("/admin/signin", { replace: true });
          return;
        }

        const userEmail = session.user.email;
        console.log('[AdminProtectedRoute] Checking admin status for:', userEmail);
        
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('email')
          .eq('email', userEmail)
          .maybeSingle();

        if (!isMounted) return;

        if (adminError) {
          console.error('[AdminProtectedRoute] Admin check error:', adminError);
          setError('Error verifying admin status');
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const isAdminUser = !!adminData;
        console.log('[AdminProtectedRoute] Admin status:', isAdminUser);
        
        if (!isAdminUser) {
          console.log('[AdminProtectedRoute] Not admin - redirecting');
          navigate("/admin/signin", { replace: true });
          return;
        }

        setIsAdmin(true);
        setLoading(false);
      } catch (error) {
        console.error('[AdminProtectedRoute] Exception:', error);
        if (isMounted) {
          setError('An unexpected error occurred');
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    checkAdminStatus();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Verifying admin access...</p>
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
    return null;
  }

  return <>{children}</>;
};
