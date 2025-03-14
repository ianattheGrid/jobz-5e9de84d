
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
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
import { InterviewTimeSelect } from "./InterviewTimeSelect";
import { InterviewResponseDialog } from "./InterviewResponseDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
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

  const handleViewTimes = (slotId: string) => {
    setExpandedSlot(slotId);
  };

  const handleResponseSubmitted = () => {
    setExpandedSlot(null);
    setResponseDialog({ isOpen: false, slotId: null, mode: 'unavailable' });
  };

  const handleBackToList = () => {
    setExpandedSlot(null);
  };

  return (
    <div className="space-y-4">
      {expandedSlot && (
        <Button
          variant="ghost"
          className="mb-4"
          onClick={handleBackToList}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Interview Offers
        </Button>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
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
            <TableRow key={slot.id}>
              <TableCell className="text-gray-900">{slot.job.company}</TableCell>
              <TableCell className="text-gray-900">{slot.job.title}</TableCell>
              <TableCell className="text-gray-900">
                <Badge variant="secondary">
                  {getInterviewTypeLabel(slot.interview_type)}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-900">
                {slot.status === 'accepted' ? (
                  <div className="text-green-600">
                    Scheduled for {format(new Date(slot.selected_time!), 'PPP p')}
                  </div>
                ) : expandedSlot === slot.id ? (
                  <div className="space-y-2">
                    <p className="text-gray-700 mb-4">
                      Please select your preferred interview time from the options below:
                    </p>
                    <InterviewTimeSelect
                      slotId={slot.id}
                      times={slot.proposed_times}
                      interviewType={slot.interview_type}
                      onResponseSubmitted={handleResponseSubmitted}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{slot.proposed_times.length} time{slot.proposed_times.length !== 1 ? 's' : ''} available</span>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-primary border-primary hover:bg-primary hover:text-white"
                      onClick={() => handleViewTimes(slot.id)}
                    >
                      View & Select Times
                    </Button>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <span className={`capitalize ${slot.status === 'accepted' ? 'text-green-600' : 'text-gray-900'}`}>
                  {slot.status}
                </span>
              </TableCell>
              <TableCell>
                {slot.status !== 'accepted' && !expandedSlot && (
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
