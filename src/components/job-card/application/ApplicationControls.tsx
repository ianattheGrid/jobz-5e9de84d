import { Button } from "@/components/ui/button";

interface ApplicationControlsProps {
  isApplying: boolean;
  onStartApply: (e: React.MouseEvent) => Promise<void>;
}

const ApplicationControls = ({ isApplying, onStartApply }: ApplicationControlsProps) => {
  if (!isApplying) {
    return (
      <Button 
        className="w-1/2 mx-auto block bg-red-800 hover:bg-red-900 text-white"
        onClick={onStartApply}
        size="sm"
      >
        Express Interest
      </Button>
    );
  }
  return null;
};

export default ApplicationControls;