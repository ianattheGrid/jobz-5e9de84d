
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  userType: 'employer' | 'candidate' | 'vr' | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    userType: null,
    loading: true
  });

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event);
            
            if (session?.user) {
              // Fetch user role from database when signed in
              try {
                const { data: roleData } = await supabase
                  .from('user_roles')
                  .select('role')
                  .eq('user_id', session.user.id)
                  .maybeSingle();
                
                const userType = roleData?.role as 'employer' | 'candidate' | 'vr' | null;
                
                setAuthState({
                  user: session.user,
                  session,
                  userType,
                  loading: false
                });
              } catch (error) {
                console.error('Error fetching user role:', error);
                setAuthState({
                  user: session.user,
                  session,
                  userType: null,
                  loading: false
                });
              }
            } else {
              // When signed out
              setAuthState({
                user: null,
                session: null,
                userType: null,
                loading: false
              });
            }
          }
        );

        // THEN check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user role from database
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          const userType = roleData?.role as 'employer' | 'candidate' | 'vr' | null;
          
          setAuthState({
            user: session.user,
            session,
            userType,
            loading: false
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            userType: null,
            loading: false
          });
        }

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          user: null,
          session: null,
          userType: null,
          loading: false
        });
      }
    };

    initAuth();
  }, []);

  return authState;
};
