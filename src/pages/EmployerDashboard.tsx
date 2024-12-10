import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Briefcase, MessageSquare, TrendingUp } from "lucide-react";
import ApplicationMessages from "@/components/ApplicationMessages";
import CandidateMatches from "@/components/CandidateMatches";

interface Application {
  id: number;
  job_id: number;
  applicant_id: string;
  status: string;
  created_at: string;
  job: {
    title: string;
    company: string;
  };
}

interface DashboardStats {
  totalApplications: number;
  activeJobs: number;
  pendingApplications: number;
  totalMatches: number;
}

const EmployerDashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    activeJobs: 0,
    pendingApplications: 0,
    totalMatches: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/employer/signin');
        return;
      }
      setUserId(user.id);
      await Promise.all([
        loadApplications(user.id),
        loadDashboardStats(user.id),
      ]);
    };

    checkAuth();
  }, [navigate]);

  const loadDashboardStats = async (userId: string) => {
    try {
      // First get all jobs for this employer
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('employer_id', userId);

      if (jobsError) throw jobsError;
      
      const jobIds = jobsData?.map(job => job.id) || [];

      // Then get applications and matches for these jobs
      const [applicationsData, matchesData] = await Promise.all([
        supabase
          .from('applications')
          .select('id, status')
          .in('job_id', jobIds),
        supabase
          .from('job_matches')
          .select('id')
          .in('job_id', jobIds),
      ]);

      if (applicationsData.error) throw applicationsData.error;
      if (matchesData.error) throw matchesData.error;

      setStats({
        totalApplications: applicationsData.data?.length || 0,
        activeJobs: jobsData?.length || 0,
        pendingApplications: applicationsData.data?.filter(app => app.status === 'pending').length || 0,
        totalMatches: matchesData.data?.length || 0,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard statistics",
      });
      console.error('Error loading stats:', error);
    }
  };

  const loadApplications = async (userId: string) => {
    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('employer_id', userId);

      if (jobsError) throw jobsError;
      
      const jobIds = jobsData?.map(job => job.id) || [];

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(title, company)
        `)
        .in('job_id', jobIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load applications",
      });
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application status updated",
      });

      // Pass userId when calling loadApplications
      if (userId) {
        loadApplications(userId);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Employer Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700">
                <Users className="h-4 w-4 inline-block mr-2" />
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalApplications}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700">
                <Briefcase className="h-4 w-4 inline-block mr-2" />
                Active Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.activeJobs}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700">
                <MessageSquare className="h-4 w-4 inline-block mr-2" />
                Pending Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.pendingApplications}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700">
                <TrendingUp className="h-4 w-4 inline-block mr-2" />
                Total Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalMatches}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Applications & Matches</CardTitle>
          <CardDescription>
            View and manage job applications, candidate matches, and communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="applications" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="matches">Candidate Matches</TabsTrigger>
            </TabsList>
            
            <TabsContent value="applications">
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Users className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900">No Applications Yet</p>
                      <p className="text-sm text-gray-500">Applications will appear here once candidates apply to your jobs.</p>
                    </CardContent>
                  </Card>
                ) : (
                  applications.map((application) => (
                    <Card key={application.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {application.job?.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {application.job?.company}
                          </p>
                          <p className="text-sm text-gray-500">
                            Applied: {new Date(application.created_at).toLocaleDateString()}
                          </p>
                          <Badge className={`mt-2 ${getStatusBadgeColor(application.status)}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <select
                            value={application.status}
                            onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                            className="w-full mb-2 border rounded-md p-2 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setSelectedApplication(application.id);
                              setSelectedJobId(application.job_id);
                            }}
                          >
                            View Messages
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="matches">
              {selectedJobId ? (
                <CandidateMatches jobId={selectedJobId} />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Users className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900">Select a Job</p>
                    <p className="text-sm text-gray-500">Select a job to view potential candidate matches</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {selectedApplication && userId && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ApplicationMessages
                    applicationId={selectedApplication}
                    currentUserId={userId}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerDashboard;