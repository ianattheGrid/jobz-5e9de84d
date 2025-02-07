import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ApplicationStatusProps {
  status: {
    id: number;
    employer_accepted: boolean;
    candidate_accepted: boolean;
  };
  onAccept: () => Promise<void>;
  onChat: () => void;
}

const ApplicationStatus = ({ status, onAccept, onChat }: ApplicationStatusProps) => {
  const { toast } = useToast();

  const handleAccept = async () => {
    try {
      await onAccept();
      toast({
        title: "Success",
        description: "Application accepted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept application",
      });
    }
  };

  if (status.employer_accepted && !status.candidate_accepted) {
    return (
      <div className="mt-6 space-y-4">
        <p className="text-sm text-green-600">The employer has accepted your application!</p>
        <Button 
          onClick={handleAccept}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Accept and View Full Details
        </Button>
      </div>
    );
  }

  if (status.employer_accepted && status.candidate_accepted) {
    return (
      <div className="mt-6 space-y-4">
        <p className="text-sm text-green-600">Match confirmed! You can now arrange an interview.</p>
        <Button 
          onClick={onChat}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Start Chat
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="text-sm text-gray-600">Application submitted - awaiting employer response</p>
    </div>
  );
};

export default ApplicationStatus;