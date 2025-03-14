
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Interview {
  id: number | string;
  scheduled_at: string;
  interviewer_name: string;
  status: string;
  interview_type: string;
  cancellation_reason?: string;
  selected_time?: string;
  job: {
    company: string;
    title: string;
  };
}

interface InterviewsTableProps {
  interviews: Interview[];
}

const InterviewsTable = ({ interviews }: InterviewsTableProps) => {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-gray-900">Company</TableHead>
          <TableHead className="text-gray-900">Position</TableHead>
          <TableHead className="text-gray-900">Interview Type</TableHead>
          <TableHead className="text-gray-900">Date</TableHead>
          <TableHead className="text-gray-900">Time</TableHead>
          <TableHead className="text-gray-900">Interviewer</TableHead>
          <TableHead className="text-gray-900">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interviews.map((interview) => (
          <TableRow key={interview.id}>
            <TableCell className="text-gray-900">{interview.job.company}</TableCell>
            <TableCell className="text-gray-900">{interview.job.title}</TableCell>
            <TableCell className="text-gray-900">
              <Badge variant="secondary">
                {getInterviewTypeLabel(interview.interview_type)}
              </Badge>
            </TableCell>
            <TableCell className="text-gray-900">
              {format(new Date(interview.selected_time || interview.scheduled_at), 'PPP')}
            </TableCell>
            <TableCell className="text-gray-900">
              {format(new Date(interview.selected_time || interview.scheduled_at), 'p')}
            </TableCell>
            <TableCell className="text-gray-900">{interview.interviewer_name || 'TBD'}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 capitalize">{interview.status}</span>
                {interview.cancellation_reason && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-gray-900">{interview.cancellation_reason}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InterviewsTable;
