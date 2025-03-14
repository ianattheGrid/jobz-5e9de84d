
import React from 'react';
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-gray-900">Company</TableHead>
          <TableHead className="text-gray-900">Position</TableHead>
          <TableHead className="text-gray-900">Offered Times</TableHead>
          <TableHead className="text-gray-900">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {slots.map((slot) => (
          <TableRow key={slot.id}>
            <TableCell className="text-gray-900">{slot.job.company}</TableCell>
            <TableCell className="text-gray-900">{slot.job.title}</TableCell>
            <TableCell className="text-gray-900">
              {slot.proposed_times.map((time) => (
                <div key={time}>{format(new Date(time), 'PPP p')}</div>
              ))}
            </TableCell>
            <TableCell>
              <span className="text-gray-900 capitalize">{slot.status}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InterviewSlots;
