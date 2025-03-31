import { useVRDashboard } from "@/hooks/useVRDashboard";
import { DashboardLoading } from "@/components/vr/dashboard/DashboardLoading";
import { DashboardError } from "@/components/vr/dashboard/DashboardError";
import { DashboardMenu } from "@/components/vr/dashboard/DashboardMenu";
import { ReferralsList } from "@/components/vr/ReferralsList";
import { DashboardStats } from "@/components/vr/dashboard/DashboardStats";
import { InactiveAccountWarning } from "@/components/vr/dashboard/InactiveAccountWarning";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, UserPlus, BarChart3, FileText, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CandidateUpdates } from "@/components/vr/CandidateUpdates";
import { RecommendationExpiryCard } from "@/components/vr/dashboard/RecommendationExpiryCard";

const VirtualRecruiterDashboard = () => {
  const { loading, error, profile, stats } = useVRDashboard();
  const navigate = useNavigate();

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return <DashboardError error={error} />;
  }

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
        
        <DashboardMenu />
        
        <RecommendationExpiryCard />
        
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
        
        <Card>
          <CardHeader>
            <CardTitle>Recommend Candidates</CardTitle>
            <CardDescription>Submit a new candidate recommendation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Two ways to recommend candidates</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center mr-3">
                        <FileText className="h-4 w-4 text-red-800" />
                      </div>
                      <h4 className="font-medium">Job-Specific Recommendation</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Recommend a candidate for a specific job vacancy with the commission rate set by the job posting.</p>
                    <Button 
                      className="w-full bg-[#FF69B4] hover:bg-[#FF50A8] text-white" 
                      onClick={() => navigate('/vr/recommendations')}
                    >
                      Recommend for a Job
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                        <UserPlus className="h-4 w-4 text-blue-600" />
                      </div>
                      <h4 className="font-medium">General Recommendation</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Add a candidate to our talent pool. You'll receive 2.5% of first year's salary if hired.</p>
                    <Button 
                      className="w-full bg-[#FF69B4] hover:bg-[#FF50A8] text-white" 
                      onClick={() => navigate('/vr/recommendations')}
                    >
                      Add to Talent Pool
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Candidate Updates</CardTitle>
            </div>
            <CardDescription>Track the progress of your recommended candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <CandidateUpdates />
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
  );
}

export default VirtualRecruiterDashboard;
