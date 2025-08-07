import React from 'react';
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
import { InterviewSlot } from './types';
import { getInterviewTypeLabel } from "./utils/interviewTypeUtils";

interface InterviewTableProps {
  slots: InterviewSlot[];
  onViewTimes: (slot: InterviewSlot) => void;
  onUnavailable: (slotId: string) => void;
  onSuggestTimes: (slotId: string) => void;
  onDecline: (slotId: string) => void;
}

const InterviewTable = ({
  slots,
  onViewTimes,
  onUnavailable,
  onSuggestTimes,
  onDecline,
}: InterviewTableProps) => {
  return (
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
                  Scheduled for {slot.selected_time}
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white bg-primary hover:bg-primary/90"
                  onClick={() => onViewTimes(slot)}
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
                    onClick={() => onUnavailable(slot.id)}
                  >
                    Can't Do These Times
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSuggestTimes(slot.id)}
                  >
                    Suggest Times
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDecline(slot.id)}
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
  );
};

export default InterviewTable;