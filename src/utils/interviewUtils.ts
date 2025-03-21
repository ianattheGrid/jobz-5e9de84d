
import { format, isToday } from "date-fns";

export interface Interview {
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

export interface InterviewGroups {
  past: Interview[];
  today: Interview[];
  future: Interview[];
}

export const groupInterviewsByTime = (interviews: Interview[] = []): InterviewGroups => {
  const now = new Date();
  return {
    past: interviews.filter(
      (interview) => new Date(interview.scheduled_at) < now && !isToday(new Date(interview.scheduled_at))
    ),
    today: interviews.filter(
      (interview) => isToday(new Date(interview.scheduled_at))
    ),
    future: interviews.filter(
      (interview) => new Date(interview.scheduled_at) > now && !isToday(new Date(interview.scheduled_at))
    ),
  };
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: format(date, "PPP"),
    time: format(date, "p"),
  };
};
