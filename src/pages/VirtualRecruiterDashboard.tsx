
import { useVRDashboard } from "@/hooks/useVRDashboard";
import { DashboardLoading } from "@/components/vr/dashboard/DashboardLoading";
import { DashboardError } from "@/components/vr/dashboard/DashboardError";
import { DashboardMenu } from "@/components/vr/dashboard/DashboardMenu";
import { ReferralsList } from "@/components/vr/ReferralsList";
import { DashboardStats } from "@/components/vr/dashboard/DashboardStats";
import { InactiveAccountWarning } from "@/components/vr/dashboard/InactiveAccountWarning";
import { ReferralInvite } from "@/components/vr/ReferralInvite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const VirtualRecruiterDashboard = () => {
  const { loading, error, profile, stats } = useVRDashboard();

  // Return loading state while profile loads
  if (loading) {
    return <DashboardLoading />;
  }

  // Return error component if there's an error
  if (error) {
    return <DashboardError error={error} />;
  }

  // Return blank page with error message if profile is null
  if (!profile) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load or create your profile. Please try signing out and back in, or contact support.
          </AlertDescription>
        </Alert>
      </div>
    );
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
              <CardTitle>Invite a Candidate</CardTitle>
              <CardDescription>Refer a new candidate to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ReferralInvite />
            </CardContent>
          </Card>
          
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
