
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isToday } from "date-fns";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CandidateInterviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: interviews, isLoading } = useQuery({
    queryKey: ["interviews", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interviews")
        .select(`
          *,
          job:jobs(id, title, company)
        `)
        .eq('candidate_id', user?.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto py-8 pt-20">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto py-8 pt-20">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Interviews</h1>
          <Button
            onClick={() => navigate('/candidate/dashboard')}
            className="text-white"
            variant="default"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>

        {interviews && interviews.length > 0 ? (
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
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No interviews scheduled yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateInterviews;
