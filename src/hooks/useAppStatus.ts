import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AppStatus {
  status: 'soft_launch' | 'live';
  launchLocation: string;
  isFreeInLaunchLocation: boolean;
}

export const useAppStatus = (appName: string) => {
  const [status, setStatus] = useState<AppStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('status, launch_location, is_free_in_launch_location')
        .eq('app_name', appName)
        .single();

      if (!error && data) {
        setStatus({
          status: data.status as 'soft_launch' | 'live',
          launchLocation: data.launch_location,
          isFreeInLaunchLocation: data.is_free_in_launch_location,
        });
      }
      setIsLoading(false);
    };

    fetchStatus();
  }, [appName]);

  return { status, isLoading };
};
