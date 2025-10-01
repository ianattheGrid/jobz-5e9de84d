import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Building2, MapPin, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExternalJob {
  id: string;
  job_title: string;
  job_description: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  job_url: string;
  scraped_at: string;
  target_companies: {
    company_name: string;
    industry_sector: string;
    website: string;
  };
}

interface JobMatch {
  match_score: number;
  match_explanation: string;
  candidate_interested: boolean | null;
}

const ExternalJobsView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<(ExternalJob & { match?: JobMatch })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchExternalJobs();
  }, [user]);

  const fetchExternalJobs = async () => {
    try {
      // Get jobs that matched for this candidate
      const { data: matches, error: matchesError } = await supabase
        .from('external_job_matches')
        .select('external_job_id, match_score, match_explanation, candidate_interested')
        .eq('candidate_id', user!.id);

      if (matchesError) throw matchesError;

      const matchedJobIds = matches?.map(m => m.external_job_id) || [];

      if (matchedJobIds.length === 0) {
        setLoading(false);
        return;
      }

      // Get the actual job details
      const { data: externalJobs, error: jobsError } = await supabase
        .from('external_jobs')
        .select('*, target_companies(company_name, industry_sector, website)')
        .in('id', matchedJobIds)
        .eq('is_active', true)
        .order('scraped_at', { ascending: false });

      if (jobsError) throw jobsError;

      // Combine jobs with match data
      const jobsWithMatches = externalJobs?.map(job => {
        const match = matches?.find(m => m.external_job_id === job.id);
        return { ...job, match };
      }) || [];

      setJobs(jobsWithMatches);
    } catch (error) {
      console.error('Error fetching external jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load job opportunities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsInterested = async (jobId: string, interested: boolean) => {
    try {
      const { error } = await supabase
        .from('external_job_matches')
        .update({ candidate_interested: interested })
        .eq('external_job_id', jobId)
        .eq('candidate_id', user!.id);

      if (error) throw error;

      toast({
        title: interested ? "Marked as Interested" : "Not Interested",
        description: interested 
          ? "We've saved this opportunity for you" 
          : "You won't see this job again",
      });

      fetchExternalJobs();
    } catch (error) {
      console.error('Error updating interest:', error);
      toast({
        title: "Error",
        description: "Failed to update your interest",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading external job opportunities...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="outline"
        onClick={() => navigate('/candidate/dashboard')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bristol SME Job Opportunities</h1>
        <p className="text-muted-foreground">
          Jobs from Bristol-based SMEs that match your profile
        </p>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No external job opportunities found yet. Check back soon!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-xl">{job.job_title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {job.target_companies.company_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      {job.salary_min && job.salary_max && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          £{job.salary_min.toLocaleString()} - £{job.salary_max.toLocaleString()}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  {job.match && (
                    <Badge 
                      variant={job.match.match_score >= 80 ? "default" : "secondary"}
                      className="ml-4"
                    >
                      {job.match.match_score}% Match
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.match?.match_explanation && (
                  <p className="text-sm text-muted-foreground">
                    {job.match.match_explanation}
                  </p>
                )}

                {job.job_description && (
                  <p className="text-sm line-clamp-3">{job.job_description}</p>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => window.open(job.job_url, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on Company Website
                  </Button>

                  {job.target_companies.website && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(job.target_companies.website, '_blank')}
                    >
                      Visit Company Website
                    </Button>
                  )}

                  {job.match?.candidate_interested === null && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => markAsInterested(job.id, true)}
                      >
                        Interested
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => markAsInterested(job.id, false)}
                      >
                        Not Interested
                      </Button>
                    </>
                  )}

                  {job.match?.candidate_interested === true && (
                    <Badge variant="outline" className="self-center">
                      ✓ Marked as Interested
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  Industry: {job.target_companies.industry_sector}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExternalJobsView;
