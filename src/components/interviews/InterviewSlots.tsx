
import React, { useState } from 'react';
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InterviewResponseDialog } from "./InterviewResponseDialog";
import { TimeSelectionDialog } from "./TimeSelectionDialog";
import { useInterviewUpdates } from "./hooks/useInterviewUpdates";
import { getInterviewTypeLabel } from "./utils/interviewTypeUtils";
import { InterviewSlot, InterviewSlotsProps } from "./types";

const InterviewSlots = ({ slots: initialSlots, onSlotAccepted }: InterviewSlotsProps) => {
  const { slots, setSlots } = useInterviewUpdates(initialSlots, onSlotAccepted);
  const [selectedSlot, setSelectedSlot] = useState<{
    isOpen: boolean;
    slot: InterviewSlot | null;
  }>({
    isOpen: false,
    slot: null
  });
  const [responseDialog, setResponseDialog] = useState<{
    isOpen: boolean;
    slotId: string | null;
    mode: 'unavailable' | 'suggest' | 'decline';
  }>({
    isOpen: false,
    slotId: null,
    mode: 'unavailable'
  });
  
  const { toast } = useToast();

  const handleSelectTime = async (slotId: string, selectedTime: string) => {
    try {
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
        
        setSelectedSlot({ isOpen: false, slot: null });
        onSlotAccepted?.(updatedSlot);
        return;
      }

      const { error } = await supabase
        .from('interview_slots')
        .update({ 
          status: 'accepted',
          selected_time: selectedTime 
        })
        .eq('id', slotId);

      if (error) throw error;

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
      
      setSelectedSlot({ isOpen: false, slot: null });
      onSlotAccepted?.(updatedSlot);
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
    setSelectedSlot({ isOpen: false, slot: null });
    setResponseDialog({ isOpen: false, slotId: null, mode: 'unavailable' });
  };

  const pendingSlots = slots.filter(slot => slot.status !== 'accepted');

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-gray-900">Company</TableHead>
            <TableHead className="text-gray-900">Position</TableHead>
            <TableHead className="text-gray-900">Interview Type</TableHead>
            <TableHead className="text-gray-900">Offered Times</TableHead>
            <TableHead className="text-gray-900">Status</TableHead>
            <TableHead className="text-gray-900">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingSlots.map((slot) => (
            <TableRow key={slot.id} className="hover:bg-transparent">
              <TableCell className="text-gray-900 font-medium">{slot.job.company}</TableCell>
              <TableCell className="text-gray-900">{slot.job.title}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                  {getInterviewTypeLabel(slot.interview_type)}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-900">
                {slot.status === 'accepted' ? (
                  <div className="text-green-600 font-medium">
                    Scheduled for {format(new Date(slot.selected_time!), 'PPP p')}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white bg-primary hover:bg-primary/90"
                    onClick={() => setSelectedSlot({ isOpen: true, slot })}
                  >
                    View Available Times ({slot.proposed_times.length})
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <span className={`capitalize ${slot.status === 'accepted' ? 'text-green-600' : 'text-gray-900'}`}>
                  {slot.status}
                </span>
              </TableCell>
              <TableCell>
                {slot.status !== 'accepted' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setResponseDialog({
                        isOpen: true,
                        slotId: slot.id,
                        mode: 'unavailable'
                      })}
                    >
                      Can't Do These Times
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setResponseDialog({
                        isOpen: true,
                        slotId: slot.id,
                        mode: 'suggest'
                      })}
                    >
                      Suggest Times
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setResponseDialog({
                        isOpen: true,
                        slotId: slot.id,
                        mode: 'decline'
                      })}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TimeSelectionDialog
        isOpen={selectedSlot.isOpen}
        onOpenChange={(isOpen) => !isOpen && setSelectedSlot({ isOpen: false, slot: null })}
        slot={selectedSlot.slot}
        onTimeSelected={handleSelectTime}
      />

      <InterviewResponseDialog
        slotId={responseDialog.slotId || ''}
        isOpen={responseDialog.isOpen}
        onClose={() => setResponseDialog({ isOpen: false, slotId: null, mode: 'unavailable' })}
        onResponseSubmitted={handleResponseSubmitted}
        mode={responseDialog.mode}
      />
    </div>
  );
};

export default InterviewSlots;
