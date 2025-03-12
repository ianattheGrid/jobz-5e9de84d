
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

interface Interview {
  id: string;
  scheduled_at: string;
  interviewer_name: string;
  status: string;
  job: {
    company: string;
    title: string;
  };
}

interface InterviewsTableProps {
  interviews: Interview[];
}

const InterviewsTable = ({ interviews }: InterviewsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Interviewer</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interviews.map((interview) => (
          <TableRow key={interview.id}>
            <TableCell>{interview.job.company}</TableCell>
            <TableCell>{interview.job.title}</TableCell>
            <TableCell>{format(new Date(interview.scheduled_at), 'PPP')}</TableCell>
            <TableCell>{format(new Date(interview.scheduled_at), 'p')}</TableCell>
            <TableCell>{interview.interviewer_name}</TableCell>
            <TableCell>
              <span className="capitalize">{interview.status}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InterviewsTable;
