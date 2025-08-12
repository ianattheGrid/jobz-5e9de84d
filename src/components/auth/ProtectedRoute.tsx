
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
        
        // Set a timeout to prevent hanging
        timeoutId = setTimeout(() => {
          if (isMounted) {
            console.error('[ProtectedRoute] Auth check timed out');
            setLoading(false);
            toast({
              variant: "destructive",
              title: "Loading Error",
              description: "Authentication check timed out. Please try signing in again.",
            });
            navigate(`/${userType}/signin`);
          }
        }, 8000); // 8 second timeout

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log(`[ProtectedRoute] Session result:`, { session: !!session, error: sessionError });
        
        if (!isMounted) return;
        
        if (sessionError) {
          console.error('[ProtectedRoute] Session error:', sessionError);
          clearTimeout(timeoutId);
          throw sessionError;
        }
        
        if (!session) {
          console.log('[ProtectedRoute] No session found, redirecting to sign in');
          clearTimeout(timeoutId);
          navigate(`/${userType}/signin`);
          return;
        }

        // Fetch the user's role from the database with timeout protection
        console.log(`[ProtectedRoute] Fetching user role for user:`, session.user.id);
        
        const rolePromise = supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        const { data: userRoleData, error: roleError } = await Promise.race([
          rolePromise,
          new Promise<{ data: null; error: Error }>((_, reject) =>
            setTimeout(() => reject(new Error('Role query timeout')), 5000)
          )
        ]);

        if (!isMounted) return;
        
        console.log(`[ProtectedRoute] User role fetch result:`, { userRoleData, roleError });

        if (roleError) {
          console.error('[ProtectedRoute] Error fetching user role:', roleError);
          clearTimeout(timeoutId);
          
          // If it's a timeout, try to continue with cached data
          if (roleError.message === 'Role query timeout') {
            const cachedUserType = session.user.user_metadata?.user_type;
            if (cachedUserType === userType) {
              console.log('[ProtectedRoute] Using cached user type from metadata');
              setAuthorized(true);
              setLoading(false);
              return;
            }
          }
          
          throw roleError;
        }
        
        if (!userRoleData) {
          console.error('[ProtectedRoute] No user role found');
          clearTimeout(timeoutId);
          await supabase.auth.signOut();
          navigate(`/${userType}/signin`);
          return;
        }

        const currentUserType = userRoleData.role;
        console.log(`[ProtectedRoute] User type check: expected=${userType}, actual=${currentUserType}`);
        
        if (currentUserType !== userType) {
          console.log(`[ProtectedRoute] User type mismatch - redirecting to home`);
          clearTimeout(timeoutId);
          navigate('/');
          return;
        }
        
        // For candidate profile page, skip profile existence check
        if (userType === 'candidate' && window.location.pathname === '/candidate/profile') {
          console.log(`[ProtectedRoute] Candidate profile page - skipping profile check`);
          if (isMounted) {
            clearTimeout(timeoutId);
            setAuthorized(true);
            setLoading(false);
          }
          return;
        }
        
        // Check if the user has a profile for this user type (with timeout)
        const profileTable = 
          userType === 'employer' ? 'employer_profiles' :
          userType === 'candidate' ? 'candidate_profiles' :
          userType === 'vr' ? 'virtual_recruiter_profiles' : null;
          
        if (profileTable) {
          console.log(`[ProtectedRoute] Checking profile in ${profileTable}`);
          
          const profilePromise = supabase
            .from(profileTable)
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();

          const { data: profile, error: profileError } = await Promise.race([
            profilePromise,
            new Promise<{ data: null; error: Error }>((_, reject) =>
              setTimeout(() => reject(new Error('Profile query timeout')), 5000)
            )
          ]);
  
          if (!isMounted) return;
          
          console.log(`[ProtectedRoute] Profile check result:`, { profile: !!profile, profileError });

          if (profileError && profileError.message !== 'Profile query timeout') {
            console.error(`[ProtectedRoute] Error fetching ${userType} profile:`, profileError);
          } else if (!profile && window.location.pathname !== `/${userType}/profile`) {
            // If no profile exists and not already on the profile page, redirect to profile page
            console.log(`[ProtectedRoute] No ${userType} profile found, redirecting to profile page`);
            clearTimeout(timeoutId);
            navigate(`/${userType}/profile`);
            return;
          }
        }
        
        // If we get here, the user is authorized
        console.log(`[ProtectedRoute] Auth check passed - user authorized`);
        if (isMounted) {
          clearTimeout(timeoutId);
          setAuthorized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('[ProtectedRoute] Error checking authentication:', error);
        if (isMounted) {
          clearTimeout(timeoutId);
          setLoading(false);
          navigate(`/${userType}/signin`);
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
