import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface CandidateMatch {
  match_score: number;
  candidate_profile: {
    job_title: string;
    years_experience: number;
    location: string;
    min_salary: number;
    max_salary: number;
  };
}

const CandidateMatches = ({ jobId }: { jobId: number }) => {
  const [sortBy, setSortBy] = useState<'score' | 'experience' | 'salary'>('score');

  const { data: matches, isLoading } = useQuery({
    queryKey: ['candidate-matches', jobId, sortBy],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_matches')
        .select(`
          match_score,
          candidate_profile:candidate_profiles(
            job_title,
            years_experience,
            location,
            min_salary,
            max_salary
          )
        `)
        .eq('job_id', jobId)
        .order(sortBy === 'score' ? 'match_score' : 
               sortBy === 'experience' ? 'candidate_profiles.years_experience' :
               'candidate_profiles.max_salary', { ascending: false });

      if (error) throw error;
      return data as CandidateMatch[];
    },
  });

  if (isLoading) {
    return <div>Loading matches...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Potential Candidates</CardTitle>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Match Score</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="salary">Salary Expectation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches?.map((match, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{match.candidate_profile.job_title}</h3>
                  <p className="text-sm text-gray-500">
                    {match.candidate_profile.years_experience} years experience
                  </p>
                  <p className="text-sm text-gray-500">
                    Location: {match.candidate_profile.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    Salary Range: £{match.candidate_profile.min_salary.toLocaleString()} - 
                    £{match.candidate_profile.max_salary.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800">
                      {match.match_score}% Match
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateMatches;