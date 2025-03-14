
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InterviewResponseDialogProps {
  slotId: string;
  isOpen: boolean;
  onClose: () => void;
  onResponseSubmitted: () => void;
  mode: 'unavailable' | 'suggest' | 'decline';
}

export const InterviewResponseDialog = ({ 
  slotId, 
  isOpen, 
  onClose, 
  onResponseSubmitted,
  mode 
}: InterviewResponseDialogProps) => {
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
  const [message, setMessage] = React.useState('');
  const { toast } = useToast();

  const getTitle = () => {
    switch (mode) {
      case 'unavailable':
        return 'Cannot Attend These Times';
      case 'suggest':
        return 'Suggest Alternative Times';
      case 'decline':
        return 'Decline Interview';
    }
  };

  const handleSubmit = async () => {
    try {
      const updates: any = {
        status: mode === 'decline' ? 'declined' : 'pending',
        candidate_message: message,
      };

      if (mode === 'suggest') {
        updates.candidate_suggested_times = selectedDates.map(date => date.toISOString());
      }

      const { error } = await supabase
        .from('interview_slots')
        .update(updates)
        .eq('id', slotId);

      if (error) throw error;

      toast({
        title: "Response sent",
        description: "The employer has been notified of your response."
      });

      onResponseSubmitted();
      onClose();
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit response. Please try again."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {mode === 'suggest' ? 
              'Select alternative dates that work better for you.' :
              'Please provide a message to the employer.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Add a message to the employer..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />

          {mode === 'suggest' && (
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={setSelectedDates as any}
              className="rounded-md border"
            />
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Send Response</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
