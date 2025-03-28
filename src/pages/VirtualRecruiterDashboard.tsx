
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client"; 
import { useNavigate } from "react-router-dom";
import { DashboardMenu } from "@/components/vr/dashboard/DashboardMenu";
import { ReferralsList } from "@/components/vr/ReferralsList";
import { DashboardStats } from "@/components/vr/dashboard/DashboardStats";
import { InactiveAccountWarning } from "@/components/vr/dashboard/InactiveAccountWarning";

const VirtualRecruiterDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserAndProfile = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/vr/signin');
          return;
        }

        // Check for existing profile
        const { data: existingProfile, error: profileError } = await supabase
          .from('virtual_recruiter_profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching VR profile:', profileError);
          setError('Failed to load your profile information. Please try again later.');
        }

        // If profile doesn't exist, create it
        if (!existingProfile) {
          try {
            console.log('Creating missing VR profile for user:', session.user.id);
            
            // Get user's role to verify they should have VR access
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .maybeSingle();
              
            if (!roleData || roleData.role !== 'vr') {
              setError('You do not have Virtual Recruiter permissions. Please contact support.');
              setLoading(false);
              return;
            }
            
            // Insert profile directly instead of using RPC function
            // since TypeScript doesn't know about our custom RPC function
            const { data: newProfile, error: createError } = await supabase
              .from('virtual_recruiter_profiles')
              .insert({
                id: session.user.id,
                full_name: session.user.user_metadata.full_name || 'New User',
                email: session.user.email || '',
                location: 'Not specified', // Default location
                bank_account_verified: false,
                is_active: true
              })
              .select('*')
              .single();
            
            if (createError || !newProfile) {
              console.error('Error creating VR profile:', createError);
              setError('Failed to create your profile. Please contact support.');
              setLoading(false);
              return;
            }
            
            setProfile(newProfile);
            
            toast({
              title: "Profile Created",
              description: "Your Virtual Recruiter profile has been created successfully."
            });
          } catch (err) {
            console.error('Error in profile creation:', err);
            setError('Failed to create your profile. Please contact support.');
          }
        } else {
          setProfile(existingProfile);
        }

        setLoading(false);
      } catch (err) {
        console.error('Dashboard loading error:', err);
        setError('An unexpected error occurred. Please try again later.');
        setLoading(false);
      }
    };

    loadUserAndProfile();
  }, [navigate, toast]);

  // Calculate stats from profile data
  const totalReferrals = profile?.recommendations_count || 0;
  const successfulPlacements = profile?.successful_placements || 0; 
  const pendingRecommendations = totalReferrals - successfulPlacements;

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Virtual Recruiter Dashboard</CardTitle>
            <CardDescription>Loading your dashboard...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF69B4]"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Virtual Recruiter Dashboard</CardTitle>
            <CardDescription>We encountered an issue with your account</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please try the following:</p>
            <ol className="list-decimal pl-5 space-y-2 mb-6">
              <li>Refresh the page and try again</li>
              <li>Sign out and sign back in</li>
              <li>Contact support if the issue persists</li>
            </ol>
            <div className="flex space-x-4">
              <Button 
                onClick={() => navigate('/vr/signin')} 
                variant="outline"
              >
                Back to Sign In
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
              >
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
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
            totalReferrals={totalReferrals}
            successfulPlacements={successfulPlacements}
            pendingRecommendations={pendingRecommendations}
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
