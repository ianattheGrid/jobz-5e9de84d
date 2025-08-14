
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InterviewFeedbackButton } from './InterviewFeedbackButton';
import { Clock, MapPin, User, Phone, Video, Calendar } from "lucide-react";

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
  interview_type?: string;
  duration_minutes?: number;
  interview_location?: string;
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

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'rescheduled':
        return <Badge variant="outline">Rescheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'in-person':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-gray-900 font-semibold">Job Details</TableHead>
            <TableHead className="text-gray-900 font-semibold">Candidate</TableHead>
            <TableHead className="text-gray-900 font-semibold">Interview Details</TableHead>
            <TableHead className="text-gray-900 font-semibold">Date & Time</TableHead>
            <TableHead className="text-gray-900 font-semibold">Status</TableHead>
            <TableHead className="text-gray-900 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((interview) => {
            const { date, time } = formatDateTime(interview.scheduled_at);
            return (
              <TableRow key={interview.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">#{interview.job.id}</p>
                    <p className="text-sm text-gray-600">{interview.job.title}</p>
                    <p className="text-xs text-gray-500">{interview.job.company}</p>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{interview.candidate_email}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getInterviewTypeIcon(interview.interview_type || 'phone')}
                      <span className="text-sm font-medium">{interview.interviewer_name}</span>
                    </div>
                    {interview.duration_minutes && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{interview.duration_minutes} mins</span>
                      </div>
                    )}
                    {interview.interview_location && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{interview.interview_location}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{date}</p>
                    <p className="text-sm text-gray-600">{time}</p>
                  </div>
                </TableCell>
                
                <TableCell>
                  {getStatusBadge(interview.status)}
                </TableCell>
                
                <TableCell>
                  <div className="flex gap-2">
                    <InterviewFeedbackButton interview={interview} />
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default InterviewTable;
