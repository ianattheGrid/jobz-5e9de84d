
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export const useWebPushNotifications = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [vapidPublicKey, setVapidPublicKey] = useState<string | null>(null);

  useEffect(() => {
    // Get VAPID public key
    const getVapidKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('configure-push');
        if (error) throw error;
        setVapidPublicKey(data.publicKey);
      } catch (error) {
        console.error('Error getting VAPID key:', error);
      }
    };

    getVapidKey();
  }, []);

  useEffect(() => {
    if (!user || !vapidPublicKey || !('serviceWorker' in navigator) || !('Notification' in window)) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidPublicKey
          });

          // Create a properly typed subscription object
          const subscriptionData: Json = {
            endpoint: sub.endpoint,
            expirationTime: sub.expirationTime,
            keys: {
              p256dh: sub.toJSON().keys.p256dh,
              auth: sub.toJSON().keys.auth
            }
          };

          const { error } = await supabase.from('user_push_subscriptions').insert({
            user_id: user.id,
            subscription: subscriptionData
          });

          if (error) throw error;
          setSubscription(sub);
        }
      } catch (error) {
        console.error('Error registering for push notifications:', error);
      }
    };

    registerServiceWorker();
  }, [user, vapidPublicKey]);

  return { subscription };
};
