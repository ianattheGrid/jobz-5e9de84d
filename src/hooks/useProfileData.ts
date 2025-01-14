import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/components/ui/use-toast';

type CandidateProfile = Database['public']['Tables']['candidate_profiles']['Row'];

export const useProfileData = (callback: (data: CandidateProfile | null) => void) => {
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          console.log('No active session found');
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
          return;
        }

        console.log('Loading existing profile:', profile);
        callback(profile);
        
      } catch (error: any) {
        console.error('Error loading profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your profile. Please try again later.",
        });
      }
    };

    loadProfile();
  }, [callback, toast]);
};