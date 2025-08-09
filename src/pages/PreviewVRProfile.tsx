
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVRProfile } from "@/hooks/useVRProfile";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/shared/ProfileCard";

export default function PreviewVRProfile() {
  const { profile, loading: profileLoading } = useVRProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  
  // Check authentication and user type
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You must be logged in to view your profile preview.",
          });
          navigate('/vr/signin');
          return;
        }

        // Check if user is a VR
        if (session.user.user_metadata.user_type !== 'vr') {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Only Connectors can access this page.",
          });
          navigate('/');
          return;
        }
        
        setAuthorized(true);
      } catch (error) {
        console.error('Error checking auth:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while checking your access permissions.",
        });
        navigate('/vr/signin');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  if (loading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authorized || !profile) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Button 
        variant="outline" 
        className="mb-6 flex items-center gap-2 bg-white text-gray-700"
        onClick={() => navigate("/vr/profile")}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Profile
      </Button>

      <div className="bg-pink-100 border-l-4 border-pink-500 p-4 mb-6">
        <p className="text-pink-700 font-medium">Preview Mode</p>
        <p className="text-sm text-pink-600">This is how your profile appears to others on the platform.</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {profile && (
          <ProfileCard
            fullName={profile.full_name}
            title="Connector"
            additionalInfo={[
              { label: "Connect ID", value: profile.vr_number || "Not assigned" },
              { label: "Location", value: profile.location || "Not specified" },
              { label: "Successful Placements", value: profile.successful_placements?.toString() || "0" },
              { label: "Recommendations", value: profile.recommendations_count?.toString() || "0" },
            ]}
          />
        )}
      </div>
    </div>
  );
};
