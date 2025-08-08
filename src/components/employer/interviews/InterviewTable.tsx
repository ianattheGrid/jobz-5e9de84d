
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
import { InterviewFeedbackButton } from './InterviewFeedbackButton';

interface Interview {
  id: number;
  job: {
    id: number;
    title: string;
    company: string;
  };
  candidate_id: string;
  candidate_email: string;
  interviewer_name: string;
  scheduled_at: string;
  status: string;
}

interface InterviewTableProps {
  interviews: Interview[];
}

const InterviewTable = ({ interviews }: InterviewTableProps) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "PPP"),
      time: format(date, "p"),
    };
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-red-800">Vacancy Ref</TableHead>
          <TableHead className="text-red-800">Position</TableHead>
          <TableHead className="text-red-800">Interviewee</TableHead>
          <TableHead className="text-red-800">Interviewer</TableHead>
          <TableHead className="text-red-800">Date</TableHead>
          <TableHead className="text-red-800">Time</TableHead>
          <TableHead className="text-red-800">Status</TableHead>
          <TableHead className="text-red-800">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interviews.map((interview) => {
          const { date, time } = formatDateTime(interview.scheduled_at);
          return (
            <TableRow key={interview.id}>
              <TableCell>#{interview.job.id}</TableCell>
              <TableCell>{interview.job.title}</TableCell>
              <TableCell>{interview.candidate_email}</TableCell>
              <TableCell>{interview.interviewer_name}</TableCell>
              <TableCell>{date}</TableCell>
              <TableCell>{time}</TableCell>
              <TableCell className="capitalize">{interview.status}</TableCell>
              <TableCell>
                <InterviewFeedbackButton interview={interview} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default InterviewTable;
