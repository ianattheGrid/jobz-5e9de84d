
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { useToast } from '@/components/ui/use-toast';

// Convert base64url VAPID key to Uint8Array for PushManager
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const useWebPushNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [vapidPublicKey, setVapidPublicKey] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    // Get VAPID public key from edge function (reads from Supabase secrets)
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

  const enableNotifications = useCallback(async () => {
    setRequested(true);
  }, []);

  useEffect(() => {
    if (!requested) return;
    if (!user || !vapidPublicKey || !('serviceWorker' in navigator) || !('Notification' in window)) {
      console.warn('Notifications prerequisites missing', { hasUser: !!user, vapidPublicKey: !!vapidPublicKey });
      setRequested(false);
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          // Reuse existing subscription if available
          let sub = await registration.pushManager.getSubscription();
          if (!sub) {
            sub = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            });
          }

          const subJson = sub.toJSON() as any;

          // Create a properly typed subscription object
          const subscriptionData: Json = {
            endpoint: sub.endpoint,
            expirationTime: sub.expirationTime,
            keys: {
              p256dh: subJson.keys.p256dh,
              auth: subJson.keys.auth
            }
          };

          const { error } = await supabase.from('user_push_subscriptions').insert({
            user_id: user.id,
            subscription: subscriptionData
          });

          if (error) throw error;
          setSubscription(sub);
          toast({ title: 'Notifications enabled', description: 'You will receive updates here.' });
          // Fire a one-off test notification
          try {
            await supabase.functions.invoke('send-test-push', {
              body: { user_id: user.id }
            });
          } catch (e) {
            console.error('Error sending test push:', e);
          }
        } else if (permission === 'denied') {
          toast({ title: 'Notifications blocked', description: 'Please enable notifications in your browser settings.' });
        }
      } catch (error) {
        console.error('Error registering for push notifications:', error);
        toast({ title: 'Failed to enable notifications', description: 'Please try again or check settings.' });
      } finally {
        setRequested(false);
      }
    };

    registerServiceWorker();
  }, [requested, user, vapidPublicKey, toast]);

  return { subscription, enableNotifications };
};
