import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface JobMatch {
  id: string;
  match_score: number;
  match_explanation: string | null;
  candidate_interested: boolean | null;
  candidate_viewed_at: string | null;
  notified_at: string;
  created_at: string;
  candidate: Array<{
    full_name: string;
    email: string;
  }>;
  job: Array<{
    job_title: string;
    location: string;
  }>;
}

export function JobMatchesTable() {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('external_job_matches')
        .select(`
          *,
          candidate:candidate_profiles!candidate_id(full_name, email),
          job:external_jobs!external_job_id(job_title, location)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading matches",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return <div className="text-muted-foreground">Loading matches...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Job Matches ({matches.length})</h3>
        <Button onClick={fetchMatches} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Match Score</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Viewed</TableHead>
              <TableHead>Notified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No matches found yet. Run the matching process to create matches.
                </TableCell>
              </TableRow>
            ) : (
              matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {match.candidate?.[0]?.full_name || 'Unknown'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {match.candidate?.[0]?.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {match.job?.[0]?.job_title || 'Unknown'}
                  </TableCell>
                  <TableCell>{match.job?.[0]?.location || '—'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={match.match_score >= 80 ? "default" : match.match_score >= 60 ? "secondary" : "outline"}
                    >
                      {match.match_score}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {match.candidate_interested === null ? (
                      <Badge variant="outline">Pending</Badge>
                    ) : match.candidate_interested ? (
                      <Badge variant="default">Interested</Badge>
                    ) : (
                      <Badge variant="secondary">Not Interested</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {match.candidate_viewed_at
                      ? format(new Date(match.candidate_viewed_at), 'MMM d')
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(match.notified_at), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
