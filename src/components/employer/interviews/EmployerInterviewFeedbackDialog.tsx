import React, { useState } from 'react';
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EmployerInterviewFeedbackDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  interview: {
    id: number;
    candidate_id: string;
    job: {
      title: string;
      company: string;
    };
  };
  employerId: string;
}

interface TimeSlot {
  date: Date | undefined;
  time: string;
}

export const EmployerInterviewFeedbackDialog = ({
  isOpen,
  onOpenChange,
  interview,
  employerId
}: EmployerInterviewFeedbackDialogProps) => {
  const { toast } = useToast();
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [message, setMessage] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ date: undefined, time: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { date: undefined, time: "" }]);
  };

  const removeTimeSlot = (index: number) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((_, i) => i !== index));
    }
  };

  const updateTimeSlot = (index: number, field: 'date' | 'time', value: Date | string) => {
    const updated = [...timeSlots];
    updated[index] = { ...updated[index], [field]: value };
    setTimeSlots(updated);
  };

  const handleSubmit = async () => {
    if (!feedbackType) {
      toast({
        variant: "destructive",
        title: "Please select a feedback option",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let nextInterviewTimes: string[] | null = null;

      if (feedbackType === 'another_interview') {
        const validTimes = timeSlots
          .filter(slot => slot.date && slot.time)
          .map(slot => {
            const [hours, minutes] = slot.time.split(':');
            const dateTime = new Date(slot.date!);
            dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            return dateTime.toISOString();
          });

        if (validTimes.length === 0) {
          toast({
            variant: "destructive",
            title: "Please add at least one interview time",
          });
          setIsSubmitting(false);
          return;
        }

        nextInterviewTimes = validTimes;
      }

      const { error } = await supabase
        .from('employer_interview_feedback')
        .insert({
          interview_id: interview.id,
          employer_id: employerId,
          feedback_type: feedbackType,
          message: message || null,
          next_interview_times: nextInterviewTimes
        });

      if (error) throw error;

      toast({
        title: "Feedback submitted successfully",
        description: "The candidate will be notified of your decision",
      });

      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        variant: "destructive",
        title: "Error submitting feedback",
        description: "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFeedbackType("");
    setMessage("");
    setTimeSlots([{ date: undefined, time: "" }]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Interview Feedback</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {interview.job.title} at {interview.job.company}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label className="text-base font-medium">What would you like to do next?</Label>
            <RadioGroup value={feedbackType} onValueChange={setFeedbackType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="offer_position" id="offer" />
                <Label htmlFor="offer" className="font-normal cursor-pointer">
                  We would like to offer you the position and will be in contact with all the details
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="another_interview" id="another" />
                <Label htmlFor="another" className="font-normal cursor-pointer">
                  We would like to invite you back for another interview
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="employer_control" id="control" />
                <Label htmlFor="control" className="font-normal cursor-pointer">
                  We will take control of the process from here
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_proceeding" id="not_proceeding" />
                <Label htmlFor="not_proceeding" className="font-normal cursor-pointer">
                  We will not be proceeding with this application
                </Label>
              </div>
            </RadioGroup>
          </div>

          {feedbackType === 'another_interview' && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Proposed Interview Times</Label>
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <Label className="text-sm font-medium">Date</Label>
                    <Calendar
                      mode="single"
                      selected={slot.date}
                      onSelect={(date) => updateTimeSlot(index, 'date', date || new Date())}
                      disabled={(date) => date < new Date()}
                      className={cn("p-3 pointer-events-auto border rounded-md")}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <Label className="text-sm font-medium">Time</Label>
                    <input
                      type="time"
                      value={slot.time}
                      onChange={(e) => updateTimeSlot(index, 'time', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  {timeSlots.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeTimeSlot(index)}
                      className="mt-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addTimeSlot}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Time
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Additional Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add any additional comments..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};