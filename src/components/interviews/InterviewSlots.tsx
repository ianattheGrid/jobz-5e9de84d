
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
          <TableHead>Company</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Proposed Times</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {slots.map((slot) => (
          <TableRow key={slot.id}>
            <TableCell>{slot.job.company}</TableCell>
            <TableCell>{slot.job.title}</TableCell>
            <TableCell>
              {slot.proposed_times.map((time) => (
                <div key={time}>{format(new Date(time), 'PPP p')}</div>
              ))}
            </TableCell>
            <TableCell>
              <span className="capitalize">{slot.status}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InterviewSlots;
