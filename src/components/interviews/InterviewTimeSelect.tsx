import React from 'react';
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface InterviewTimeSelectProps {
  slotId: string;
  times: string[];
  interviewType: string;
  onResponseSubmitted: () => void;
}

export const InterviewTimeSelect = ({ slotId, times, interviewType, onResponseSubmitted }: InterviewTimeSelectProps) => {
  const { toast } = useToast();

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
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="secondary" className="text-sm">
          {getInterviewTypeLabel(interviewType)}
        </Badge>
      </div>
      
      <div className="grid gap-3">
        {times.map((time) => (
          <Button
            key={time}
            variant="outline"
            className="w-full justify-between hover:border-primary hover:text-primary group"
            onClick={() => handleSelectTime(time)}
          >
            <span>{format(new Date(time), 'PPP p')}</span>
            <span className="hidden group-hover:flex items-center text-primary">
              <Check className="w-4 h-4 mr-2" />
              Accept Time
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
