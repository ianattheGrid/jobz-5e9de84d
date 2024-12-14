import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.user_metadata.user_type !== 'employer') {
        navigate('/employer/signin');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while checking authentication",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Employer Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Quick Actions</h2>
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/employer/create-vacancy')}
              className="w-full bg-red-800 hover:bg-red-900 text-white"
            >
              Post New Job
            </Button>
            <Button
              onClick={() => navigate('/employer/manage-jobs')}
              className="w-full bg-red-800 hover:bg-red-900 text-white"
            >
              Manage Jobs
            </Button>
            <Button
              onClick={() => navigate('/employer/candidate-search')}
              className="w-full bg-red-800 hover:bg-red-900 text-white"
            >
              Search Candidates
            </Button>
            <Button
              onClick={() => navigate('/employer/interviews')}
              className="w-full bg-red-800 hover:bg-red-900 text-white"
            >
              View Interviews
            </Button>
            <Button
              onClick={() => navigate('/employer/profile')}
              className="w-full bg-red-800 hover:bg-red-900 text-white"
            >
              Manage Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;