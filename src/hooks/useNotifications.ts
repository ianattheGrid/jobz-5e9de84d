
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useNotifications = () => {
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const setupNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Subscribe to notifications
      const channel = supabase
        .channel('push_notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'push_notifications',
            filter: `user_id=eq.${user?.id}`
          },
          async (payload) => {
            // Show toast notification
            toast({
              title: payload.new.title,
              description: payload.new.message,
            });

            // Trigger push notification
            try {
              await supabase.functions.invoke('send-push-notification', {
                body: { notification_id: payload.new.id }
              });
            } catch (error) {
              console.error('Failed to send push notification:', error);
            }

            // Update unread count
            setUnreadCount(prev => prev + 1);
          }
        )
        .subscribe();

      // Fetch initial unread count
      fetchUnreadCount();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupNotifications();
  }, []);

  const fetchUnreadCount = async () => {
    const { count } = await supabase
      .from('push_notifications')
      .select('*', { count: 'exact' })
      .eq('is_read', false)
      .single();

    setUnreadCount(count || 0);
  };

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('push_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return { unreadCount, markAsRead };
};
