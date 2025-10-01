import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log('[AdminProtectedRoute] Checking admin status...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('[AdminProtectedRoute] Session error:', sessionError);
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        if (!session) {
          console.log('[AdminProtectedRoute] No session found - user not logged in');
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const userEmail = session.user.email;
        console.log('[AdminProtectedRoute] Checking admin status for email:', userEmail);
        
        const { data: adminData, error } = await supabase
          .from('admins')
          .select('email')
          .eq('email', userEmail)
          .maybeSingle();

        if (error) {
          console.error('[AdminProtectedRoute] Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          const isAdminUser = !!adminData;
          console.log('[AdminProtectedRoute] Admin check result:', isAdminUser);
          setIsAdmin(isAdminUser);
        }
      } catch (error) {
        console.error('[AdminProtectedRoute] Exception in admin check:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
