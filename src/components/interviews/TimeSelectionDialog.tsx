
import React from 'react';
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InterviewSlot } from './types';

interface TimeSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  slot: InterviewSlot | null;
  onTimeSelected: (slotId: string, time: string) => void;
}

export const TimeSelectionDialog = ({ 
  isOpen, 
  onOpenChange, 
  slot, 
  onTimeSelected 
}: TimeSelectionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-primary">Select Interview Time</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {slot?.proposed_times.map((time) => (
            <Button
              key={time}
              className="w-full p-4 bg-white border border-gray-200 hover:bg-gray-50 text-left justify-between items-center"
              variant="outline"
              onClick={() => onTimeSelected(slot.id, time)}
            >
              <span className="text-gray-900 font-medium">{format(new Date(time), 'PPP p')}</span>
              <span className="text-primary">Schedule Interview</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
