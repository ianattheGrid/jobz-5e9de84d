import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCandidateAuthCheck } from "@/hooks/useCandidateAuthCheck";
import MatchScoreDisplay from "@/components/candidate/MatchScoreDisplay";
import { CalendarIcon, MapPinIcon, Building2Icon } from "lucide-react";
import { format } from "date-fns";

interface Application {
  id: number;
  job_id: number;
  status: string;
  created_at: string;
  match_percentage: number | null;
  match_score_breakdown: any;
  match_explanation: string | null;
  jobs: {
    title: string;
    company: string;
    location: string;
    salary_min: number;
    salary_max: number;
  } | null;
}

const CandidateApplications = () => {
  const { user } = useAuth();
  const { loading: authLoading } = useCandidateAuthCheck();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !authLoading) {
      fetchApplications();
    }
  }, [user, authLoading]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          job_id,
          status,
          created_at,
          match_percentage,
          match_score_breakdown,
          match_explanation,
          jobs!inner (
            title,
            company,
            location,
            salary_min,
            salary_max
          )
        `)
        .eq('applicant_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data as any || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
          <p className="text-muted-foreground">
            Track your job applications and view your match scores
          </p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet.</p>
                <a 
                  href="/jobs" 
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Browse Jobs
                </a>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">
                        {application.jobs?.title || 'Job Title Unavailable'}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {application.jobs && (
                          <>
                            <div className="flex items-center gap-1">
                              <Building2Icon className="h-4 w-4" />
                              {application.jobs.company}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4" />
                              {application.jobs.location}
                            </div>
                          </>
                        )}
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          Applied {format(new Date(application.created_at), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Job Details</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {application.jobs && (
                            <p>Salary: £{application.jobs.salary_min?.toLocaleString()} - £{application.jobs.salary_max?.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {application.match_percentage && (
                      <div>
                        <MatchScoreDisplay
                          matchPercentage={application.match_percentage}
                          scoreBreakdown={application.match_score_breakdown}
                          matchExplanation={application.match_explanation}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateApplications;