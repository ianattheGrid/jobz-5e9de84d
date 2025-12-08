import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserType = 'candidate' | 'employer';

export interface WebbyPreferences {
  id?: string;
  user_id: string;
  user_type: UserType;
  webby_enabled: boolean;
  anonymity_level: 'semi_anonymous' | 'first_name_only' | 'full';
  onboarding_completed: boolean;
}

export const useWebbyPreferences = (userType: UserType) => {
  const [preferences, setPreferences] = useState<WebbyPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, [userType]);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('webby_preferences')
        .select('*')
        .eq('user_id', user.id)
        .eq('user_type', userType)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferences({
          ...data,
          user_type: data.user_type as UserType,
          anonymity_level: data.anonymity_level as 'semi_anonymous' | 'first_name_only' | 'full'
        });
      } else {
        setPreferences({
          user_id: user.id,
          user_type: userType,
          webby_enabled: false,
          anonymity_level: 'semi_anonymous',
          onboarding_completed: false
        });
      }
    } catch (error) {
      console.error('Error loading Webby preferences:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load Webby preferences'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleWebby = async (enabled: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('webby_preferences')
        .upsert({
          user_id: user.id,
          user_type: userType,
          webby_enabled: enabled,
          anonymity_level: preferences?.anonymity_level || 'semi_anonymous',
          onboarding_completed: preferences?.onboarding_completed || false
        }, {
          onConflict: 'user_id,user_type'
        });

      if (error) throw error;

      setPreferences(prev => prev ? { ...prev, webby_enabled: enabled } : null);

      toast({
        title: enabled ? 'Webby enabled!' : 'Webby disabled',
        description: enabled 
          ? 'Webby will help you find matches' 
          : 'You can re-enable Webby anytime'
      });
    } catch (error) {
      console.error('Error toggling Webby:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update Webby preferences'
      });
    }
  };

  const updateAnonymityLevel = async (level: 'semi_anonymous' | 'first_name_only' | 'full') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('webby_preferences')
        .upsert({
          user_id: user.id,
          user_type: userType,
          webby_enabled: preferences?.webby_enabled || false,
          anonymity_level: level,
          onboarding_completed: preferences?.onboarding_completed || false
        }, {
          onConflict: 'user_id,user_type'
        });

      if (error) throw error;

      setPreferences(prev => prev ? { ...prev, anonymity_level: level } : null);
    } catch (error) {
      console.error('Error updating anonymity level:', error);
      throw error;
    }
  };

  return {
    preferences,
    loading,
    toggleWebby,
    updateAnonymityLevel,
    refresh: loadPreferences
  };
};
