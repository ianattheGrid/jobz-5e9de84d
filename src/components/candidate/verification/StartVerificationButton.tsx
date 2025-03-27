
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

type StartVerificationButtonProps = {
  loading: boolean;
  onClick: () => void;
};

export const StartVerificationButton = ({ loading, onClick }: StartVerificationButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={loading}
      className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
    >
      <Shield className="w-4 h-4 mr-2" />
      {loading ? "Starting..." : "Start Verification"}
    </Button>
  );
};
