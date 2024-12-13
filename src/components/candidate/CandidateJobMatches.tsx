import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CandidateJobMatchesProps {
  userId: string;
}

const CandidateJobMatches = ({ userId }: CandidateJobMatchesProps) => {
  const navigate = useNavigate();
  
  const { data: matches, isLoading } = useQuery({
    queryKey: ['job-matches', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_matches')
        .select(`
          *,
          job:jobs(
            id,
            title,
            company,
            location,
            salary_min,
            salary_max
          )
        `)
        .eq('candidate_id', userId)
        .order('match_score', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading matches...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Matches</CardTitle>
      </CardHeader>
      <CardContent>
        {matches?.length === 0 ? (
          <p className="text-gray-500">No job matches found.</p>
        ) : (
          <div className="space-y-4">
            {matches?.map((match) => (
              <Card key={match.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{match.job.title}</h3>
                    <p className="text-sm text-gray-500">{match.job.company}</p>
                    <p className="text-sm text-gray-500">{match.job.location}</p>
                    <p className="text-sm text-gray-500">
                      £{match.job.salary_min.toLocaleString()} - £{match.job.salary_max.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {match.match_score}% Match
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/jobs/${match.job.id}`)}
                    >
                      View Job
                    </Button>
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

export default CandidateJobMatches;