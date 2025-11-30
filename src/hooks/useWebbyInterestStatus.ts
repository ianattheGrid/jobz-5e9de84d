import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type WebbyInterestStatus = 
  | 'matched'
  | 'employer_interested'
  | 'candidate_viewed'
  | 'candidate_interested_anon'
  | 'chatting'
  | 'declined';

interface InterestStatusData {
  status: WebbyInterestStatus;
  candidate_first_name: string | null;
  declined_by: string | null;
  candidate_viewed_at: string | null;
  employer_viewed_at: string | null;
}

interface StatusLabels {
  employerLabel: string;
  candidateLabel: string;
}

export const getStatusLabels = (
  statusData: InterestStatusData | null,
  isOnline: boolean,
  candidateFirstName?: string,
  employerName?: string
): StatusLabels => {
  if (!statusData) {
    return {
      employerLabel: isOnline ? 'Active now' : '',
      candidateLabel: ''
    };
  }

  const { status, candidate_first_name } = statusData;

  const labels: Record<WebbyInterestStatus, StatusLabels> = {
    matched: {
      employerLabel: isOnline ? 'Active now' : '',
      candidateLabel: ''
    },
    employer_interested: {
      employerLabel: 'Alert sent – awaiting response',
      candidateLabel: 'Employer interested – waiting for your response'
    },
    candidate_viewed: {
      employerLabel: 'Viewed alert – considering',
      candidateLabel: "You're viewing this role"
    },
    candidate_interested_anon: {
      employerLabel: 'Interested – awaiting next step',
      candidateLabel: "You've shown interest – employer notified"
    },
    chatting: {
      employerLabel: `Chatting with ${candidate_first_name || candidateFirstName || 'candidate'}`,
      candidateLabel: `You're now chatting with ${employerName || 'employer'}`
    },
    declined: {
      employerLabel: 'Not interested',
      candidateLabel: 'You passed on this role'
    }
  };

  return labels[status];
};

export const useWebbyInterestStatus = (
  candidateId: string,
  employerId: string,
  jobId: number
) => {
  const [statusData, setStatusData] = useState<InterestStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('webby_interests')
          .select('status, candidate_first_name, declined_by, candidate_viewed_at, employer_viewed_at')
          .eq('candidate_id', candidateId)
          .eq('employer_id', employerId)
          .eq('job_id', jobId)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setStatusData({
            status: data.status as WebbyInterestStatus,
            candidate_first_name: data.candidate_first_name,
            declined_by: data.declined_by,
            candidate_viewed_at: data.candidate_viewed_at,
            employer_viewed_at: data.employer_viewed_at
          });
        }
      } catch (error) {
        console.error('Error fetching interest status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`interest:${candidateId}:${employerId}:${jobId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'webby_interests',
          filter: `candidate_id=eq.${candidateId},employer_id=eq.${employerId},job_id=eq.${jobId}`
        },
        (payload) => {
          if (payload.new && 'status' in payload.new) {
            const newData = payload.new as any;
            setStatusData({
              status: newData.status as WebbyInterestStatus,
              candidate_first_name: newData.candidate_first_name,
              declined_by: newData.declined_by,
              candidate_viewed_at: newData.candidate_viewed_at,
              employer_viewed_at: newData.employer_viewed_at
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [candidateId, employerId, jobId]);

  return { statusData, loading };
};
