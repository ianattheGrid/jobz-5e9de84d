import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScheduleInterviewDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  applicationId: number;
  candidateId: string;
  employerId: string;
  jobTitle: string;
}

interface TimeSlot {
  date: Date | undefined;
  time: string;
}

export const ScheduleInterviewDialog = ({
  isOpen,
  onOpenChange,
  applicationId,
  candidateId,
  employerId,
  jobTitle
}: ScheduleInterviewDialogProps) => {
  const { toast } = useToast();
  const [interviewType, setInterviewType] = useState<string>('phone');
  const [interviewStage, setInterviewStage] = useState<string>('1');
  const [duration, setDuration] = useState<string>('60');
  const [customDuration, setCustomDuration] = useState<string>('');
  const [interviewerName, setInterviewerName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ date: undefined, time: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { date: undefined, time: '' }]);
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
    if (!interviewerName.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter the interviewer's name"
      });
      return;
    }

    const validTimeSlots = timeSlots.filter(slot => slot.date && slot.time);
    if (validTimeSlots.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing Time Slots",
        description: "Please add at least one valid time slot"
      });
      return;
    }

    if (interviewType === 'in_person' && !location.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Location",
        description: "Please specify the interview location"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const proposedTimes = validTimeSlots.map(slot => {
        const dateTime = new Date(slot.date!);
        const [hours, minutes] = slot.time.split(':');
        dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return dateTime.toISOString();
      });

      const finalDuration = duration === 'other' ? parseInt(customDuration) : parseInt(duration);

      const { error } = await supabase
        .from('interview_slots')
        .insert({
          job_id: applicationId,
          employer_id: employerId,
          candidate_id: candidateId,
          proposed_times: proposedTimes,
          interview_type: interviewType,
          interview_stage: parseInt(interviewStage),
          duration_minutes: finalDuration,
          duration_other: duration === 'other' ? customDuration : null,
          interview_location: location || null,
          interviewer_name: interviewerName,
          employer_notes: notes || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Interview Scheduled",
        description: "Interview invitation has been sent to the candidate"
      });

      onOpenChange(false);
      
      // Reset form
      setInterviewType('phone');
      setInterviewStage('1');
      setDuration('60');
      setCustomDuration('');
      setInterviewerName('');
      setLocation('');
      setNotes('');
      setTimeSlots([{ date: undefined, time: '' }]);

    } catch (error: any) {
      console.error('Error scheduling interview:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to schedule interview"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Interview - {jobTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Interview Type */}
          <div className="space-y-2">
            <Label htmlFor="interview-type">Interview Type</Label>
            <Select value={interviewType} onValueChange={setInterviewType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone Interview</SelectItem>
                <SelectItem value="video">Video Interview</SelectItem>
                <SelectItem value="in_person">In-Person Interview</SelectItem>
                <SelectItem value="assessment">Assessment/Test</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interview Stage */}
          <div className="space-y-2">
            <Label htmlFor="interview-stage">Interview Stage</Label>
            <Select value={interviewStage} onValueChange={setInterviewStage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Stage 1 - Initial Interview</SelectItem>
                <SelectItem value="2">Stage 2 - Second Interview</SelectItem>
                <SelectItem value="3">Stage 3 - Final Interview</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Interview Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="180">3 hours</SelectItem>
                <SelectItem value="other">Other (specify)</SelectItem>
              </SelectContent>
            </Select>
            {duration === 'other' && (
              <Input
                placeholder="Duration in minutes"
                type="number"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
              />
            )}
          </div>

          {/* Interviewer Name */}
          <div className="space-y-2">
            <Label htmlFor="interviewer">Interviewer Name</Label>
            <Input
              id="interviewer"
              placeholder="Who will be conducting the interview?"
              value={interviewerName}
              onChange={(e) => setInterviewerName(e.target.value)}
            />
          </div>

          {/* Location (for in-person interviews) */}
          {interviewType === 'in_person' && (
            <div className="space-y-2">
              <Label htmlFor="location">Interview Location</Label>
              <Input
                id="location"
                placeholder="Enter the interview location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          )}

          {/* Time Slots */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Available Time Slots</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTimeSlot}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Slot
              </Button>
            </div>

            {timeSlots.map((slot, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !slot.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {slot.date ? format(slot.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={slot.date}
                        onSelect={(date) => updateTimeSlot(index, 'date', date || new Date())}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex-1">
                  <Input
                    type="time"
                    value={slot.time}
                    onChange={(e) => updateTimeSlot(index, 'time', e.target.value)}
                  />
                </div>
                {timeSlots.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeTimeSlot(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information for the candidate..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};