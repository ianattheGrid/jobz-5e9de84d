
import { CandidateForm } from "@/components/candidate/CandidateForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

export default function CandidateProfile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Please sign in as a candidate to update your profile.",
          });
          navigate('/');
          return;
        }

        const userType = session.user.user_metadata.user_type;
        if (userType !== 'candidate') {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Only candidates can access this page.",
          });
          navigate('/');
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while loading your profile.",
        });
      }
    };

    checkAuth();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Update Your Profile</h1>
            <p className="text-primary text-sm">
              Keep your profile up to date to find the best job matches.
            </p>
          </div>
          <Button
            onClick={() => navigate('/candidate/dashboard')}
            style={{ backgroundColor: "#FF69B4", color: "white" }}
            className="hover:bg-[#FF50A8]"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>
        <div className="flex justify-center">
          <CandidateForm />
        </div>
      </div>
    </div>
  );
}
