
import { useVRDashboard } from "@/hooks/useVRDashboard";
import { DashboardLoading } from "@/components/vr/dashboard/DashboardLoading";
import { DashboardError } from "@/components/vr/dashboard/DashboardError";
import { InactiveAccountWarning } from "@/components/vr/dashboard/InactiveAccountWarning";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, UserCheck, TrendingUp, FileText, UserPlus, ChevronDown, Bell, MessageSquare, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SessionTimeoutHandler } from "@/components/auth/SessionTimeoutHandler";
import NavBar from "@/components/NavBar";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ReferralsList } from "@/components/vr/ReferralsList";
import { CandidateUpdates } from "@/components/vr/CandidateUpdates";

const VirtualRecruiterDashboard = () => {
  const { loading, error, profile, stats } = useVRDashboard();
  const navigate = useNavigate();
  const [referralsOpen, setReferralsOpen] = useState(false);
  const [updatesOpen, setUpdatesOpen] = useState(false);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="pt-16">
          <DashboardLoading />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="pt-16">
          <DashboardError error={error} />
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto py-8 pt-16">
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load or create your profile. Please try signing out and back in, or contact support.
            </AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8 pt-16">
        <SessionTimeoutHandler />
        
        <div className="space-y-6">
          {!profile.is_active && <InactiveAccountWarning />}
          
          {/* Welcome Header */}
          <div className="text-center pb-6">
            <h1 className="text-2xl font-bold text-foreground">Connector Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your referrals and recommendations</p>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Total Referrals</h3>
                    <p className="text-2xl font-bold text-primary">{stats.totalReferrals}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Successful Placements</h3>
                    <p className="text-2xl font-bold text-green-700">{stats.successfulPlacements}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Pending</h3>
                    <p className="text-2xl font-bold text-blue-700">{stats.pendingRecommendations}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* WhatsApp Referrals - Now the primary method */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <MessageCircle className="h-5 w-5" />
                WhatsApp Referrals
              </CardTitle>
              <CardDescription className="text-green-700">
                Send referral invitations directly via WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-green-700">
                  Share your referral link instantly with candidates through WhatsApp messaging.
                </p>
                <Button 
                  disabled
                  className="w-full bg-green-600 hover:bg-green-700 text-white disabled:bg-green-300 disabled:text-green-600"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send WhatsApp Invitation
                </Button>
                <p className="text-xs text-green-600 text-center">
                  Coming soon - pending WhatsApp Business approval
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Collapsible Sections */}
          <div className="space-y-4">
            <Collapsible open={updatesOpen} onOpenChange={setUpdatesOpen}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <CardTitle>Candidate Updates</CardTitle>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${updatesOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <CardDescription>Track the progress of your recommended candidates</CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <CandidateUpdates />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Collapsible open={referralsOpen} onOpenChange={setReferralsOpen}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <CardTitle>Referrals</CardTitle>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${referralsOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <CardDescription>Candidates you have referred to the platform</CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <ReferralsList />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        </div>
      </div>
    </>
  );
}

export default VirtualRecruiterDashboard;
