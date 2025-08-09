
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const PreviewButton = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePreview = async () => {
    try {
      // Get the current session
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to preview your profile.",
        });
        return;
      }

      // Check if this is a VR user
      if (session.user.user_metadata.user_type !== 'vr') {
        toast({
          variant: "destructive",
          title: "Access denied",
          description: "Only Connectors can preview their profiles.",
        });
        return;
      }

      // Navigate to the preview page in the same tab
      navigate('/vr/profile/preview');
    } catch (error) {
      console.error("Error handling preview:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while trying to preview your profile.",
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
