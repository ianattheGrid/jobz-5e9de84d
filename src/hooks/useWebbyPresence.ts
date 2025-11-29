import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { RealtimeChannel } from '@supabase/supabase-js';

interface PresenceState {
  [key: string]: {
    user_id: string;
    user_type: string;
    online_at: string;
  }[];
}

interface InterestSignal {
  from_user_id: string;
  from_user_type: string;
  to_user_id: string;
  type: 'quick_look' | 'interested';
  candidate_id?: string;
  employer_id?: string;
  job_id?: number;
}

export const useWebbyPresence = (userType: 'candidate' | 'employer') => {
  const { user } = useAuth();
  const [onlineCount, setOnlineCount] = useState(0);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [incomingInterest, setIncomingInterest] = useState<InterestSignal | null>(null);
  const [matchNotification, setMatchNotification] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const presenceChannel = supabase.channel('webby-live', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Track presence
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState() as PresenceState;
        const allUsers = Object.values(state).flat();
        const otherUserType = userType === 'candidate' ? 'employer' : 'candidate';
        const count = allUsers.filter(u => u.user_type === otherUserType).length;
        setOnlineCount(count);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .on('broadcast', { event: 'interest' }, ({ payload }) => {
        if (payload.to_user_id === user.id) {
          console.log('Received interest signal:', payload);
          setIncomingInterest(payload as InterestSignal);
        }
      })
      .on('broadcast', { event: 'match' }, ({ payload }) => {
        if (payload.candidate_id === user.id || payload.employer_id === user.id) {
          console.log('Match notification:', payload);
          setMatchNotification(payload);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user.id,
            user_type: userType,
            online_at: new Date().toISOString(),
          });

          // Update database presence
          await supabase
            .from('webby_presence')
            .upsert({
              user_id: user.id,
              user_type: userType,
              is_online: true,
              last_seen: new Date().toISOString(),
            });
        }
      });

    setChannel(presenceChannel);

    // Cleanup
    return () => {
      presenceChannel.untrack();
      presenceChannel.unsubscribe();
      
      // Update database to offline
      supabase
        .from('webby_presence')
        .update({
          is_online: false,
          last_seen: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .then();
    };
  }, [user, userType]);

  const broadcastInterest = async (signal: Omit<InterestSignal, 'from_user_id' | 'from_user_type'>) => {
    if (!channel || !user) return;

    await channel.send({
      type: 'broadcast',
      event: 'interest',
      payload: {
        ...signal,
        from_user_id: user.id,
        from_user_type: userType,
      },
    });
  };

  const clearIncomingInterest = () => {
    setIncomingInterest(null);
  };

  const clearMatchNotification = () => {
    setMatchNotification(null);
  };

  return {
    onlineCount,
    incomingInterest,
    matchNotification,
    broadcastInterest,
    clearIncomingInterest,
    clearMatchNotification,
  };
};
