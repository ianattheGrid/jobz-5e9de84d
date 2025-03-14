
import React from 'react';
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InterviewTimeSelectProps {
  slotId: string;
  times: string[];
  onResponseSubmitted: () => void;
}

export const InterviewTimeSelect = ({ slotId, times, onResponseSubmitted }: InterviewTimeSelectProps) => {
  const { toast } = useToast();

  const handleSelectTime = async (selectedTime: string) => {
    try {
      const { error } = await supabase
        .from('interview_slots')
        .update({ 
          status: 'accepted',
          selected_time: selectedTime 
        })
        .eq('id', slotId);

      if (error) throw error;

      toast({
        title: "Interview time selected",
        description: "The employer has been notified of your selection."
      });
      
      onResponseSubmitted();
    } catch (error) {
      console.error('Error selecting interview time:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to select interview time. Please try again."
      });
    }
  };

  return (
    <div className="space-y-2">
      {times.map((time) => (
        <Button
          key={time}
          variant="outline"
          className="w-full justify-start"
          onClick={() => handleSelectTime(time)}
        >
          {format(new Date(time), 'PPP p')}
        </Button>
      ))}
    </div>
  );
};
