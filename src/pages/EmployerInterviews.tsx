import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isToday } from "date-fns";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const EmployerInterviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: interviews, isLoading } = useQuery({
    queryKey: ["interviews", user?.id],
    queryFn: async () => {
      const { data: interviewsData, error } = await supabase
        .from("interviews")
        .select(`
          *,
          job:jobs(id, title, company)
        `)
        .eq('employer_id', user?.id)
        .order("scheduled_at", { ascending: true });

      if (error) throw error;

      const candidateIds = interviewsData?.map(interview => interview.candidate_id) || [];
      const { data: profileData } = await supabase
        .from('candidate_profiles')
        .select('id')
        .in('id', candidateIds);

      return (interviewsData || []).map(interview => ({
        ...interview,
        candidate_email: interview.candidate_id,
        job: interview.job as { id: number; title: string; company: string }
      })) as Interview[];
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
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-red-800 border-r-transparent" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const groupInterviewsByTime = (interviews: Interview[] = []) => {
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "PPP"),
      time: format(date, "p"),
    };
  };

  const InterviewTable = ({ interviews }: { interviews: Interview[] }) => (
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
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  const { past, today, future } = groupInterviewsByTime(interviews);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary [&]:!text-primary">Interview Schedule</h1>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="bg-red-50">
          <TabsTrigger 
            value="today"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Today's Interviews ({today.length})
          </TabsTrigger>
          <TabsTrigger 
            value="upcoming"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Upcoming Interviews ({future.length})
          </TabsTrigger>
          <TabsTrigger 
            value="past"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Past Interviews ({past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          {today.length === 0 ? (
            <p className="text-gray-500">No interviews scheduled for today.</p>
          ) : (
            <InterviewTable interviews={today} />
          )}
        </TabsContent>

        <TabsContent value="upcoming">
          {future.length === 0 ? (
            <p className="text-gray-500">No upcoming interviews scheduled.</p>
          ) : (
            <InterviewTable interviews={future} />
          )}
        </TabsContent>

        <TabsContent value="past">
          {past.length === 0 ? (
            <p className="text-gray-500">No past interviews.</p>
          ) : (
            <InterviewTable interviews={past} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployerInterviews;
