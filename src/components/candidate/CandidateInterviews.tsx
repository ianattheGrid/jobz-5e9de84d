import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface CandidateInterviewsProps {
  userId: string;
}

const CandidateInterviews = ({ userId }: CandidateInterviewsProps) => {
  const { data: interviews, isLoading } = useQuery({
    queryKey: ['interviews', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          job:jobs(
            title,
            company
          )
        `)
        .eq('candidate_id', userId)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading interviews...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Interviews</CardTitle>
      </CardHeader>
      <CardContent>
        {interviews?.length === 0 ? (
          <p className="text-gray-500">No interviews scheduled.</p>
        ) : (
          <div className="space-y-4">
            {interviews?.map((interview) => (
              <Card key={interview.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{interview.job.title}</h3>
                      <p className="text-sm text-gray-500">{interview.job.company}</p>
                    </div>
                    <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {interview.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Interviewer: {interview.interviewer_name}</p>
                    <p>Date: {format(new Date(interview.scheduled_at), 'PPP')}</p>
                    <p>Time: {format(new Date(interview.scheduled_at), 'p')}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CandidateInterviews;