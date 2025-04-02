
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PreviewButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => window.location.href = '/candidate/profile/preview'}
      className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-[#FF69B4] hover:bg-[#FF50A8]"
    >
      <Eye className="w-4 h-4 mr-2" />
      Preview Public Profile
    </Button>
  );
};
