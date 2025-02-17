
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  userType: 'employer' | 'recruiter' | 'candidate' | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userType: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthState({
          user: session.user,
          userType: session.user.user_metadata.user_type || null,
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthState({
          user: session.user,
          userType: session.user.user_metadata.user_type || null,
        });
      } else {
        setAuthState({ user: null, userType: null });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return authState;
};
