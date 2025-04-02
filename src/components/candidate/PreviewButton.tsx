
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const PreviewButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePreview = async () => {
    try {
      // Check current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to preview your profile",
        });
        navigate('/candidate/signin');
        return;
      }

      // Get user role to ensure they're a candidate
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (!userRole || userRole.role !== "candidate") {
        toast({
          variant: "destructive",
          title: "Access denied",
          description: "Only candidates can preview their profile",
        });
        return;
      }

      console.log("Navigating to candidate profile preview");
      navigate('/candidate/profile/preview');
    } catch (error) {
      console.error("Error checking authentication:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again later.",
      });
    }
  };

  return (
    <Button
      onClick={handlePreview}
      className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-[#FF69B4] hover:bg-[#FF50A8]"
    >
      <Eye className="w-4 h-4 mr-2" />
      Preview Public Profile
    </Button>
  );
};
