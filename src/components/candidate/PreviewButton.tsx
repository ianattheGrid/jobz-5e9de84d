
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const PreviewButton = () => {
  const handleClick = () => {
    // Use plain JavaScript navigation to avoid any React Router issues
    const previewUrl = '/candidate/profile/preview';
    window.location.href = previewUrl;
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
