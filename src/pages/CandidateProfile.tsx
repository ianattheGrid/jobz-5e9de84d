import { CandidateForm } from "@/components/candidate/CandidateForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function CandidateProfile() {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
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
    };

    checkAuth();
  }, [navigate, toast]);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4 text-black text-left">Update Your Profile</h1>
      <p className="text-[#ea384c] mb-8 text-sm text-left">
        Keep your profile up to date to find the best job matches.
      </p>
      <div className="flex justify-center">
        <CandidateForm />
      </div>
    </div>
  );
}