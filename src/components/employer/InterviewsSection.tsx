import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";

interface Interview {
  id: number;
  job: {
    id: number;
    title: string;
  };
  candidate_id: string;
  interviewer_name: string;
  scheduled_at: string;
  status: string;
}

const InterviewsSection = ({ employerId }: { employerId: string }) => {
  const { data: interviews, isLoading } = useQuery({
    queryKey: ["employer-interviews", employerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interviews")
        .select(`
          *,
          job:jobs(id, title)
        `)
        .eq("employer_id", employerId)
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      return data as Interview[];
    },
    enabled: !!employerId,
  });

  const groupInterviews = (interviews: Interview[] = []) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      past: interviews.filter(
        (interview) => new Date(interview.scheduled_at) < today
      ),
      today: interviews.filter(
        (interview) =>
          new Date(interview.scheduled_at) >= today &&
          new Date(interview.scheduled_at) < tomorrow
      ),
      future: interviews.filter(
        (interview) => new Date(interview.scheduled_at) >= tomorrow
      ),
    };
  };

  const InterviewTable = ({ interviews }: { interviews: Interview[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vacancy Ref</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Interviewer</TableHead>
          <TableHead>Candidate ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interviews.map((interview) => (
          <TableRow key={interview.id}>
            <TableCell>#{interview.job.id}</TableCell>
            <TableCell>{interview.job.title}</TableCell>
            <TableCell>{interview.interviewer_name}</TableCell>
            <TableCell>{interview.candidate_id}</TableCell>
            <TableCell>
              {format(new Date(interview.scheduled_at), "PPP")}
            </TableCell>
            <TableCell>
              {format(new Date(interview.scheduled_at), "p")}
            </TableCell>
            <TableCell className="capitalize">{interview.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  const { past, today, future } = groupInterviews(interviews);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Interviews Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">
              Today's Interviews ({today.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming Interviews ({future.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Interviews ({past.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            {today.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  No interviews scheduled for today
                </p>
              </div>
            ) : (
              <InterviewTable interviews={today} />
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            {future.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  No upcoming interviews scheduled
                </p>
              </div>
            ) : (
              <InterviewTable interviews={future} />
            )}
          </TabsContent>

          <TabsContent value="past">
            {past.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No past interviews</p>
              </div>
            ) : (
              <InterviewTable interviews={past} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InterviewsSection;