
import { useVRDashboard } from "@/hooks/useVRDashboard";
import { DashboardLoading } from "@/components/vr/dashboard/DashboardLoading";
import { DashboardError } from "@/components/vr/dashboard/DashboardError";
import { DashboardMenu } from "@/components/vr/dashboard/DashboardMenu";
import { ReferralsList } from "@/components/vr/ReferralsList";
import { DashboardStats } from "@/components/vr/dashboard/DashboardStats";
import { InactiveAccountWarning } from "@/components/vr/dashboard/InactiveAccountWarning";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const VirtualRecruiterDashboard = () => {
  const { loading, error, profile, stats } = useVRDashboard();

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return <DashboardError error={error} />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Menu Column */}
        <div className="lg:col-span-3">
          <DashboardMenu />
        </div>

        {/* Main Content Column */}
        <div className="lg:col-span-9 space-y-6">
          {!profile.is_active && <InactiveAccountWarning />}
          
          <DashboardStats 
            totalReferrals={stats.totalReferrals}
            successfulPlacements={stats.successfulPlacements}
            pendingRecommendations={stats.pendingRecommendations}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Referrals</CardTitle>
              <CardDescription>Candidates you have referred to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ReferralsList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VirtualRecruiterDashboard;
