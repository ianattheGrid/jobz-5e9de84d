
import { Button } from "@/components/ui/button";

type StartVerificationButtonProps = {
  loading: boolean;
  onClick: () => void;
};

export const StartVerificationButton = ({ loading, onClick }: StartVerificationButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className="w-full sm:w-auto bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
    >
      {loading ? "Starting Verification..." : "Start Verification"}
    </Button>
  );
};
