
import React, { useState, useEffect } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InterviewResponseDialog } from "./InterviewResponseDialog";

interface InterviewSlot {
  id: string;
  job: {
    company: string;
    title: string;
  };
  proposed_times: string[];
  status: string;
  interview_type: string;
  selected_time?: string;
}

interface InterviewSlotsProps {
  slots: InterviewSlot[];
  onSlotAccepted?: () => void;
}

const InterviewSlots = ({ slots: initialSlots, onSlotAccepted }: InterviewSlotsProps) => {
  const [slots, setSlots] = useState<InterviewSlot[]>(initialSlots);
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
          setSlots(currentSlots => 
            currentSlots.map(slot => 
              slot.id === payload.new.id ? { ...slot, ...payload.new } : slot
            )
          );

          if (payload.new.status === 'accepted') {
            toast({
              title: "Interview Scheduled",
              description: `Interview time has been confirmed for ${format(new Date(payload.new.selected_time), 'PPP p')}`
            });
            onSlotAccepted?.();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onSlotAccepted, toast]);

  const getInterviewTypeLabel = (type: string) => {
    const types = {
      'online': 'Online Video Interview',
      'phone': 'Telephone Interview',
      'face-to-face': 'Face to Face Interview',
      'group': 'Group Interview',
      'assessment': 'Assessment Center',
      'technical': 'Technical Interview'
    };
    return types[type as keyof typeof types] || type;
  };

  const handleSelectTime = async (slotId: string, selectedTime: string) => {
    try {
      // Ensure the slotId is a valid UUID
      if (!slotId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        throw new Error('Invalid slot ID format');
      }

      const { error } = await supabase
        .from('interview_slots')
        .update({ 
          status: 'accepted',
          selected_time: selectedTime 
        })
        .eq('id', slotId);

      if (error) throw error;

      toast({
        title: "Interview Scheduled",
        description: `Your interview has been scheduled for ${format(new Date(selectedTime), 'PPP p')}`
      });
      
      setSelectedSlot({ isOpen: false, slot: null });
      onSlotAccepted?.();
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
          {slots.map((slot) => (
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

      <Dialog open={selectedSlot.isOpen} onOpenChange={(isOpen) => !isOpen && setSelectedSlot({ isOpen: false, slot: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Interview Time</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedSlot.slot?.proposed_times.map((time) => (
              <Button
                key={time}
                className="w-full p-4 bg-white border border-gray-200 hover:bg-gray-50 text-left justify-between items-center"
                variant="outline"
                onClick={() => handleSelectTime(selectedSlot.slot!.id, time)}
              >
                <span className="text-gray-900 font-medium">{format(new Date(time), 'PPP p')}</span>
                <span className="text-primary">Schedule Interview</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
