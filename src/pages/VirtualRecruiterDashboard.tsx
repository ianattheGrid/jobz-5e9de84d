import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, CheckCircle, AlertCircle } from "lucide-react";

interface DashboardStats {
  recommendations_count: number;
  successful_placements: number;
  pending_recommendations: number;
  total_commission: number;
}

const VirtualRecruiterDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    recommendations_count: 0,
    successful_placements: 0,
    pending_recommendations: 0,
    total_commission: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/vr/signin");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("virtual_recruiter_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        const { data: recommendations, error: recommendationsError } = await supabase
          .from("candidate_recommendations")
          .select("status")
          .eq("vr_id", user.id);

        if (recommendationsError) throw recommendationsError;

        const pendingCount = recommendations?.filter(r => r.status === 'pending').length || 0;

        setStats({
          recommendations_count: profile.recommendations_count || 0,
          successful_placements: profile.successful_placements || 0,
          pending_recommendations: pendingCount,
          total_commission: 0, // This will be implemented in a future update
        });

        setLoading(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data",
        });
        console.error("Dashboard loading error:", error);
      }
    };

    loadDashboardData();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Virtual Recruiter Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Recommendations</p>
              <p className="text-2xl font-bold">{stats.recommendations_count}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Successful Placements</p>
              <p className="text-2xl font-bold">{stats.successful_placements}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Recommendations</p>
              <p className="text-2xl font-bold">{stats.pending_recommendations}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Commission</p>
              <p className="text-2xl font-bold">£{stats.total_commission}</p>
            </div>
            <Briefcase className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button onClick={() => navigate("/vr/recommend")}>
          New Recommendation
        </Button>
        <Button variant="outline" onClick={() => navigate("/vr/recommendations")}>
          View All Recommendations
        </Button>
      </div>
    </div>
  );
};

export default VirtualRecruiterDashboard;