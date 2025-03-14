
import { useState, useEffect } from 'react';
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InterviewSlot } from '../types';

export const useInterviewUpdates = (
  initialSlots: InterviewSlot[],
  onSlotAccepted?: (slot: InterviewSlot) => void
) => {
  const [slots, setSlots] = useState<InterviewSlot[]>(initialSlots);
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('interview-slots-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'interview_slots'
        },
        (payload) => {
          setSlots(currentSlots => {
            const updatedSlots = currentSlots.map(slot => 
              slot.id === payload.new.id ? { ...slot, ...payload.new } : slot
            );

            if (payload.new.status === 'accepted') {
              toast({
                title: "Interview Scheduled",
                description: `Interview time has been confirmed for ${format(new Date(payload.new.selected_time), 'PPP p')}`
              });

              const matchingSlot = currentSlots.find(slot => slot.id === payload.new.id);
              const updatedSlot: InterviewSlot = {
                id: payload.new.id,
                job: matchingSlot?.job || {
                  company: '',
                  title: ''
                },
                proposed_times: payload.new.proposed_times || [],
                status: payload.new.status,
                interview_type: payload.new.interview_type,
                selected_time: payload.new.selected_time
              };
              
              onSlotAccepted?.(updatedSlot);
            }

            return updatedSlots;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onSlotAccepted, toast]);

  return { slots, setSlots };
};
