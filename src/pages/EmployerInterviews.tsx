import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Interview {
  id: number;
  job: {
    id: number;
    title: string;
    company: string;
  };
  candidate: {
    email: string;
  };
  candidate_id: string;
  interviewer_name: string;
  scheduled_at: string;
  status: string;
}

const EmployerInterviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: interviews, isLoading } = useQuery({
    queryKey: ["interviews", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interviews")
        .select(`
          *,
          job:jobs(id, title, company),
          candidate:candidate_id(email)
        `)
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      return data as Interview[];
    },
    enabled: !!user,
  });

  if (!user) {
    navigate("/employer/signin");
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const groupInterviewsByStatus = (interviews: Interview[] = []) => {
    const now = new Date();
    return {
      upcoming: interviews.filter(
        (interview) => new Date(interview.scheduled_at) > now && interview.status !== "cancelled"
      ),
      past: interviews.filter(
        (interview) => new Date(interview.scheduled_at) <= now || interview.status === "cancelled"
      ),
    };
  };

  const { upcoming, past } = groupInterviewsByStatus(interviews);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "PPP"),
      time: format(date, "p"),
    };
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Interviews</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Interviews</h2>
          {upcoming.length === 0 ? (
            <p className="text-gray-500">No upcoming interviews scheduled.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vacancy Ref</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Interviewee</TableHead>
                  <TableHead>Interviewer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcoming.map((interview) => {
                  const { date, time } = formatDateTime(interview.scheduled_at);
                  return (
                    <TableRow key={interview.id}>
                      <TableCell>#{interview.job.id}</TableCell>
                      <TableCell>{interview.job.title}</TableCell>
                      <TableCell>{interview.candidate.email}</TableCell>
                      <TableCell>{interview.interviewer_name}</TableCell>
                      <TableCell>{date}</TableCell>
                      <TableCell>{time}</TableCell>
                      <TableCell className="capitalize">{interview.status}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Past Interviews</h2>
          {past.length === 0 ? (
            <p className="text-gray-500">No past interviews.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vacancy Ref</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Interviewee</TableHead>
                  <TableHead>Interviewer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {past.map((interview) => {
                  const { date, time } = formatDateTime(interview.scheduled_at);
                  return (
                    <TableRow key={interview.id}>
                      <TableCell>#{interview.job.id}</TableCell>
                      <TableCell>{interview.job.title}</TableCell>
                      <TableCell>{interview.candidate.email}</TableCell>
                      <TableCell>{interview.interviewer_name}</TableCell>
                      <TableCell>{date}</TableCell>
                      <TableCell>{time}</TableCell>
                      <TableCell className="capitalize">{interview.status}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerInterviews;