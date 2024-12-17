import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ReferralsList } from "@/components/vr/ReferralsList";
import { ReferralInvite } from "@/components/vr/ReferralInvite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Users,
  Mail,
  ChartBar,
  Settings,
  UserCheck
} from "lucide-react";
import { TestAccountsCreator } from "@/components/test/TestAccountsCreator";

interface DashboardStats {
  totalReferrals: number;
  successfulPlacements: number;
  pendingRecommendations: number;
  isActive: boolean;
}

const VirtualRecruiterDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalReferrals: 0,
    successfulPlacements: 0,
    pendingRecommendations: 0,
    isActive: true
  });

  useEffect(() => {
    checkUser();
    loadDashboardStats();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.user_metadata.user_type !== 'vr') {
        navigate('/vr/signin');
        return;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while checking authentication",
      });
    }
  };

  const loadDashboardStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('virtual_recruiter_profiles')
        .select('recommendations_count, successful_placements, is_active')
        .eq('id', session.user.id)
        .single();

      const { count: pendingRecommendations } = await supabase
        .from('candidate_recommendations')
        .select('*', { count: 'exact', head: true })
        .eq('vr_id', session.user.id)
        .eq('status', 'pending');

      if (profile) {
        setStats({
          totalReferrals: profile.recommendations_count || 0,
          successfulPlacements: profile.successful_placements || 0,
          pendingRecommendations: pendingRecommendations || 0,
          isActive: profile.is_active
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard statistics",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800"></div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Referrals",
      value: stats.totalReferrals,
      icon: <Users className="h-6 w-6 text-red-800" />,
    },
    {
      title: "Successful Placements",
      value: stats.successfulPlacements,
      icon: <UserCheck className="h-6 w-6 text-green-600" />,
    },
    {
      title: "Pending Recommendations",
      value: stats.pendingRecommendations,
      icon: <ChartBar className="h-6 w-6 text-blue-600" />,
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Virtual Recruiter Dashboard</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/vr/recommendations')}
            className="bg-red-800 hover:bg-red-900 text-white"
          >
            <Mail className="mr-2 h-4 w-4" />
            View Recommendations
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('#')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {!stats.isActive && (
        <Card className="mb-8 border-yellow-500 bg-yellow-50">
          <CardContent className="p-4">
            <p className="text-yellow-800">
              Your account is currently inactive. Please complete your profile setup or contact support.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invite Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <ReferralInvite />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <ReferralsList />
            </CardContent>
          </Card>
        </div>
      </div>

      <TestAccountsCreator />
    </div>
  );
};

export default VirtualRecruiterDashboard;