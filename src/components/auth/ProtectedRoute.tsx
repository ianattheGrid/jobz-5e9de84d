
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

        // Fetch the user's role from the database
        console.log(`[ProtectedRoute] Fetching user role for user:`, session.user.id);
        const { data: userRoleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!isMounted) return;
        
        console.log(`[ProtectedRoute] User role fetch result:`, { userRoleData, roleError });

        if (roleError) {
          console.error('[ProtectedRoute] Error fetching user role:', roleError);
          throw roleError;
        }
        
        if (!userRoleData) {
          console.error('[ProtectedRoute] No user role found');
          await supabase.auth.signOut();
          navigate(`/${userType}/signin`);
          return;
        }

        const currentUserType = userRoleData.role;
        console.log(`[ProtectedRoute] User type check: expected=${userType}, actual=${currentUserType}`);
        
        if (currentUserType !== userType) {
          console.log(`[ProtectedRoute] User type mismatch - redirecting to home`);
          navigate('/');
          return;
        }
        
        // For candidate profile page, skip profile existence check
        if (userType === 'candidate' && window.location.pathname === '/candidate/profile') {
          console.log(`[ProtectedRoute] Candidate profile page - skipping profile check`);
          if (isMounted) {
            setAuthorized(true);
            setLoading(false);
          }
          return;
        }
        
        // Check if the user has a profile for this user type
        const profileTable = 
          userType === 'employer' ? 'employer_profiles' :
          userType === 'candidate' ? 'candidate_profiles' :
          userType === 'vr' ? 'virtual_recruiter_profiles' : null;
          
        if (profileTable) {
          console.log(`[ProtectedRoute] Checking profile in ${profileTable}`);
          const { data: profile, error: profileError } = await supabase
            .from(profileTable)
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();
  
          if (!isMounted) return;
          
          console.log(`[ProtectedRoute] Profile check result:`, { profile: !!profile, profileError });

          if (profileError) {
            console.error(`[ProtectedRoute] Error fetching ${userType} profile:`, profileError);
          } else if (!profile && window.location.pathname !== `/${userType}/profile`) {
            // If no profile exists and not already on the profile page, redirect to profile page
            console.log(`[ProtectedRoute] No ${userType} profile found, redirecting to profile page`);
            navigate(`/${userType}/profile`);
            return;
          }
        }
        
        // If we get here, the user is authorized
        console.log(`[ProtectedRoute] Auth check passed - user authorized`);
        if (isMounted) {
          setAuthorized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('[ProtectedRoute] Error checking authentication:', error);
        if (isMounted) {
          setLoading(false);
          navigate(`/${userType}/signin`);
        }
      }
    };

    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, [navigate, userType]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};
