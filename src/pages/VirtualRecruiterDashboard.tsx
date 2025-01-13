import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Settings } from "lucide-react";
import { DashboardStats } from "@/components/vr/dashboard/DashboardStats";
import { DashboardMenu } from "@/components/vr/dashboard/DashboardMenu";
import { InactiveAccountWarning } from "@/components/vr/dashboard/InactiveAccountWarning";
import { ReferralsList } from "@/components/vr/ReferralsList";
import { ReferralInvite } from "@/components/vr/ReferralInvite";

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

      const { data: profile, error } = await supabase
        .from('virtual_recruiter_profiles')
        .select('recommendations_count, successful_placements, is_active')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (!profile) {
        toast({
          variant: "destructive",
          title: "Profile Not Found",
          description: "Your VR profile could not be found. Please contact support.",
        });
        navigate('/vr/signin');
        return;
      }

      const { count: pendingRecommendations } = await supabase
        .from('candidate_recommendations')
        .select('*', { count: 'exact', head: true })
        .eq('vr_id', session.user.id)
        .eq('status', 'pending');

      setStats({
        totalReferrals: profile.recommendations_count || 0,
        successfulPlacements: profile.successful_placements || 0,
        pendingRecommendations: pendingRecommendations || 0,
        isActive: profile.is_active ?? true
      });
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Virtual Recruiter Dashboard</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/vr/recommendations')}
            className="bg-primary hover:bg-primary-dark text-white"
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

      {!stats.isActive && <InactiveAccountWarning />}
      
      <DashboardStats {...stats} />
      
      <DashboardMenu />

      <div className="grid gap-8 md:grid-cols-2 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Invite Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <ReferralInvite />
          </CardContent>
        </Card>
        
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
  );
};

export default VirtualRecruiterDashboard;