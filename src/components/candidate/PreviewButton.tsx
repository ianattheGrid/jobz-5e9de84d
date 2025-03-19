
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const PreviewButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/candidate/profile/preview')}
      className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
    >
      <Eye className="w-4 h-4 mr-2" />
      Preview Public Profile
    </Button>
  );
};
