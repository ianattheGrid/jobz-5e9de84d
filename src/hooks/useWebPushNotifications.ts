
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useWebPushNotifications = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if (!user || !('serviceWorker' in navigator) || !('Notification' in window)) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY' // We'll need to set this up
          });

          // Store subscription in Supabase for the user
          await supabase
            .from('user_push_subscriptions')
            .upsert({
              user_id: user.id,
              subscription: JSON.stringify(sub)
            })
            .eq('user_id', user.id);

          setSubscription(sub);
        }
      } catch (error) {
        console.error('Error registering for push notifications:', error);
      }
    };

    registerServiceWorker();
  }, [user]);

  return { subscription };
};
