
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
      <div className="space-y-8">
        {!profile.is_active && <InactiveAccountWarning />}
        
        {/* Menu at the top */}
        <DashboardMenu />
        
        {/* Stats in the second row */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-muted-foreground mb-1">Total Referrals</h3>
                  <p className="text-3xl font-bold">{stats.totalReferrals}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Users className="h-5 w-5 text-red-800" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-muted-foreground mb-1">Successful Placements</h3>
                  <p className="text-3xl font-bold">{stats.successfulPlacements}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-muted-foreground mb-1">Pending Recommendations</h3>
                  <p className="text-3xl font-bold">{stats.pendingRecommendations}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Invite a Candidate Card */}
        <Card>
          <CardHeader>
            <CardTitle>Invite a Candidate</CardTitle>
            <CardDescription>Refer a new candidate to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ReferralInvite />
          </CardContent>
        </Card>
        
        {/* Referrals Card */}
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
  );
};

export default VirtualRecruiterDashboard;
