
import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/components/ui/use-toast';

type CandidateProfile = Database['public']['Tables']['candidate_profiles']['Row'];

export const useProfileData = (callback: (data: CandidateProfile | null) => void) => {
  const { toast } = useToast();
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadProfile = useCallback(async () => {
    if (hasLoaded) return; // Prevent multiple loads
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.log('No active session found');
        callback(null);
        setHasLoaded(true);
        return;
      }

      const { data: profile, error } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your profile. Please try again later.",
        });
        callback(null);
        setHasLoaded(true);
        return;
      }

      console.log('Loading existing profile:', profile);
      callback(profile);
      setHasLoaded(true);
      
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your profile. Please try again later.",
      });
      callback(null);
      setHasLoaded(true);
    }
  }, [callback, toast, hasLoaded]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);
};
