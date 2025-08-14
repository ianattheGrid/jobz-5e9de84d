
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
    const setupAuth = async () => {
      try {
        // Check for existing session first
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Found existing session:', session.user.email);
          try {
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
          } catch (error) {
            console.error('Error fetching existing user role:', error);
            setAuthState({
              user: session.user,
              session,
              userType: null,
              loading: false
            });
          }
        } else {
          // No session found, user is not logged in
          setAuthState({
            user: null,
            session: null,
            userType: null,
            loading: false
          });
        }

        // Set up auth state listener for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('Auth state changed:', event);
            
            if (session?.user) {
              // Use setTimeout to defer database calls and prevent infinite loops
              setTimeout(async () => {
                try {
                  // Fetch user role from database when signed in
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
              }, 0);
            } else {
              // When signed out - immediate update, no async calls needed
              setAuthState({
                user: null,
                session: null,
                userType: null,
                loading: false
              });
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
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

    setupAuth();
  }, []);

  return authState;
};
