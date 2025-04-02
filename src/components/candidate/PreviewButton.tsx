
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PreviewButtonProps {
  onPreviewClick: () => void;
}

export const PreviewButton = ({ onPreviewClick }: PreviewButtonProps) => {
  const { toast } = useToast();

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

      // Check if this is a candidate user
      if (session.user.user_metadata.user_type !== 'candidate') {
        toast({
          variant: "destructive",
          title: "Access denied",
          description: "Only candidates can preview their profiles.",
        });
        return;
      }

      // Use the callback to show the profile preview in the current page
      onPreviewClick();

      // Also open the preview page in a new tab with the user ID
      const previewUrl = `/candidate/profile/preview?id=${session.user.id}`;
      window.open(previewUrl, '_blank');

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
