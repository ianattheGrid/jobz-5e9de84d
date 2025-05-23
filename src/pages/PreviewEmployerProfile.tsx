
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployerProfile } from "@/hooks/useEmployerProfile";
import ViewEmployerProfile from "./ViewEmployerProfile";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/candidate-search/LoadingState";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PreviewEmployerProfile() {
  const { profile, loading: profileLoading } = useEmployerProfile();
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
          navigate('/employer/signin');
          return;
        }

        // Check if user is an employer
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();
          
        if (!userRole || userRole.role !== 'employer') {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Only employers can access this page.",
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
        navigate('/employer/signin');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  // Redirect if profile is not found
  useEffect(() => {
    if (!profileLoading && !profile.id && authorized) {
      toast({
        title: "Profile Needed",
        description: "Please complete your profile first to preview it.",
      });
      navigate("/employer/profile");
    }
  }, [profileLoading, profile, navigate, toast, authorized]);

  if (loading || profileLoading) {
    return <LoadingState />;
  }

  if (!authorized || !profile.id) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Button 
        variant="outline" 
        className="mb-6 flex items-center gap-2 bg-white text-gray-700"
        onClick={() => navigate("/employer/profile")}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Profile
      </Button>
      
      <ViewEmployerProfile previewMode={true} employerId={profile.id} />
    </div>
  );
}
