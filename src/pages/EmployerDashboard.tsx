import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ApplicationMessages from "@/components/ApplicationMessages";

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

const EmployerDashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
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
      loadApplications();
    };

    checkAuth();
  }, [navigate]);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(title, company)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load applications",
      });
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

      loadApplications();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Applications Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="applications">
            <TabsList>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              {selectedApplication && (
                <TabsTrigger value="messages">Messages</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="applications">
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {application.job?.title} - {application.job?.company}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Applied: {new Date(application.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {application.status}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <select
                          value={application.status}
                          onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                          className="border rounded p-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button
                          onClick={() => setSelectedApplication(application.id)}
                          className="text-blue-600 hover:underline"
                        >
                          View Messages
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            {selectedApplication && userId && (
              <TabsContent value="messages">
                <ApplicationMessages
                  applicationId={selectedApplication}
                  currentUserId={userId}
                />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerDashboard;