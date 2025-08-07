import React from 'react';
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InterviewResponseDialog } from "./dialogs/InterviewResponseDialog";
import { TimeSelectionDialog } from "./dialogs/TimeSelectionDialog";
import { useInterviewUpdates } from "./hooks/useInterviewUpdates";
import { useInterviewDialogs } from "./hooks/useInterviewDialogs";
import InterviewTable from "./InterviewTable";
import { InterviewSlot, InterviewSlotsProps } from "./types";

const InterviewSlots = ({ slots: initialSlots, onSlotAccepted }: InterviewSlotsProps) => {
  const { slots, setSlots } = useInterviewUpdates(initialSlots, onSlotAccepted);
  const {
    timeSelectionDialog,
    responseDialog,
    openTimeSelection,
    closeTimeSelection,
    openResponseDialog,
    closeResponseDialog
  } = useInterviewDialogs();
  
  const { toast } = useToast();

  const handleSelectTime = async (slotId: string, selectedTime: string) => {
    try {
      // For preview slots, handle locally
      if (slotId.startsWith('slot-')) {
        const updatedSlot = {
          ...slots.find(slot => slot.id === slotId)!,
          status: 'accepted',
          selected_time: selectedTime
        };
        
        setSlots(currentSlots => 
          currentSlots.filter(slot => slot.id !== slotId)
        );
        
        toast({
          title: "Interview Scheduled",
          description: `Your interview has been scheduled for ${format(new Date(selectedTime), 'PPP p')}`
        });
        
        closeTimeSelection();
        onSlotAccepted?.(updatedSlot);
        return;
      }

      // For real slots, update in Supabase
      const { error } = await supabase
        .from('interview_slots')
        .update({ 
          status: 'accepted',
          selected_time: selectedTime 
        })
        .eq('id', slotId);

      if (error) {
        throw error;
      }

      closeTimeSelection();
    } catch (error: any) {
      console.error('Error selecting interview time:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule interview. Please try again."
      });
    }
  };

  const handleResponseSubmitted = () => {
    closeTimeSelection();
    closeResponseDialog();
  };

  const pendingSlots = slots.filter(slot => slot.status !== 'accepted');

  return (
    <div className="space-y-6">
      <InterviewTable
        slots={pendingSlots}
        onViewTimes={openTimeSelection}
        onUnavailable={(slotId) => openResponseDialog(slotId, 'unavailable')}
        onSuggestTimes={(slotId) => openResponseDialog(slotId, 'suggest')}
        onDecline={(slotId) => openResponseDialog(slotId, 'decline')}
      />

      <TimeSelectionDialog
        isOpen={timeSelectionDialog.isOpen}
        onOpenChange={(isOpen) => !isOpen && closeTimeSelection()}
        slot={timeSelectionDialog.slot}
        onTimeSelected={handleSelectTime}
      />

      <InterviewResponseDialog
        slotId={responseDialog.slotId || ''}
        isOpen={responseDialog.isOpen}
        onClose={closeResponseDialog}
        onResponseSubmitted={handleResponseSubmitted}
        mode={responseDialog.mode}
      />
    </div>
  );
};

export default InterviewSlots;