
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const PreviewButton = () => {
  const handleClick = async () => {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    // Create a URL with session info if available
    let previewUrl = '/candidate/profile/preview';
    
    // If there's an active session, pass the user ID as a query parameter
    if (session?.user?.id) {
      previewUrl += `?id=${session.user.id}`;
    }
    
    // Open in a new tab
    window.open(previewUrl, '_blank');
  };

  return (
    <Button
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-[#FF69B4] hover:bg-[#FF50A8]"
    >
      <Eye className="w-4 h-4 mr-2" />
      Preview Public Profile
    </Button>
  );
};
