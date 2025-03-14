
import React from 'react';
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InterviewTimeSelectProps {
  slotId: string;
  times: string[];
  interviewType: string;
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
        title: "Interview Scheduled",
        description: `Your interview has been scheduled for ${format(new Date(selectedTime), 'PPP p')}`
      });
      
      onResponseSubmitted();
    } catch (error) {
      console.error('Error selecting interview time:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule interview. Please try again."
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {times.map((time) => (
          <Button
            key={time}
            className="w-full py-6 text-base justify-between bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-primary"
            onClick={() => handleSelectTime(time)}
          >
            <span className="text-left flex-1">{format(new Date(time), 'PPP p')}</span>
            <span className="text-primary font-medium">Schedule Interview</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
