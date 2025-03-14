
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
            if (payload.new.status === 'accepted') {
              const matchingSlot = currentSlots.find(slot => slot.id === payload.new.id);
              if (matchingSlot) {
                const updatedSlot: InterviewSlot = {
                  ...matchingSlot,
                  ...payload.new,
                };
                
                onSlotAccepted?.(updatedSlot);

                toast({
                  title: "Interview Scheduled",
                  description: `Interview time has been confirmed for ${format(new Date(payload.new.selected_time), 'PPP p')}`
                });
                
                return currentSlots.filter(slot => slot.id !== payload.new.id);
              }
            }

            return currentSlots.map(slot => 
              slot.id === payload.new.id ? { ...slot, ...payload.new } : slot
            );
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
