
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
import { InterviewTimeSelect } from "./InterviewTimeSelect";
import { InterviewResponseDialog } from "./InterviewResponseDialog";

interface InterviewSlot {
  id: string;
  job: {
    company: string;
    title: string;
  };
  proposed_times: string[];
  status: string;
}

interface InterviewSlotsProps {
  slots: InterviewSlot[];
}

const InterviewSlots = ({ slots }: InterviewSlotsProps) => {
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

  const handleResponseSubmitted = () => {
    setExpandedSlot(null);
    setResponseDialog({ isOpen: false, slotId: null, mode: 'unavailable' });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-gray-900">Company</TableHead>
          <TableHead className="text-gray-900">Position</TableHead>
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
              {expandedSlot === slot.id ? (
                <InterviewTimeSelect
                  slotId={slot.id}
                  times={slot.proposed_times}
                  onResponseSubmitted={handleResponseSubmitted}
                />
              ) : (
                <div>
                  {slot.proposed_times.length} time{slot.proposed_times.length !== 1 ? 's' : ''} offered
                  <Button 
                    variant="link" 
                    onClick={() => setExpandedSlot(slot.id)}
                    className="ml-2"
                  >
                    View times
                  </Button>
                </div>
              )}
            </TableCell>
            <TableCell>
              <span className="text-gray-900 capitalize">{slot.status}</span>
            </TableCell>
            <TableCell>
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <InterviewResponseDialog
        slotId={responseDialog.slotId || ''}
        isOpen={responseDialog.isOpen}
        onClose={() => setResponseDialog({ isOpen: false, slotId: null, mode: 'unavailable' })}
        onResponseSubmitted={handleResponseSubmitted}
        mode={responseDialog.mode}
      />
    </Table>
  );
};

export default InterviewSlots;
