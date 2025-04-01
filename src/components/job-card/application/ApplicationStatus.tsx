
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, MessageSquare, XCircle } from "lucide-react";

interface ApplicationStatusProps {
  status: {
    id: number;
    employer_accepted: boolean | null;
    candidate_accepted: boolean | null;
    status: string;
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

  // Rejected application
  if (status.employer_accepted === false) {
    return (
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <XCircle className="text-red-500 h-5 w-5" />
          <p className="text-red-500 font-medium">Application Rejected</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Unfortunately, the employer has declined this application. We encourage you to apply for other positions that match your skills and experience.
        </p>
      </div>
    );
  }

  // Approved but candidate hasn't accepted
  if (status.employer_accepted === true && !status.candidate_accepted) {
    return (
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-green-500 h-5 w-5" />
          <p className="text-green-600 font-medium">Application Approved!</p>
        </div>
        <p className="text-sm">
          Great news! The employer has accepted your application and would like to proceed with the interview process.
        </p>
        <Button 
          onClick={handleAccept}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Accept and View Full Details
        </Button>
      </div>
    );
  }

  // Both parties accepted - matched
  if (status.employer_accepted && status.candidate_accepted) {
    return (
      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-500 h-5 w-5" />
            <p className="text-green-600 font-medium">Match Confirmed!</p>
          </div>
          <Badge className="bg-green-600">Matched</Badge>
        </div>
        <p className="text-sm">
          You've been matched with this employer! You can now arrange an interview and discuss next steps.
        </p>
        <Button 
          onClick={onChat}
          className="w-full bg-blue-600 hover:bg-blue-700"
          leftIcon={<MessageSquare className="mr-2 h-4 w-4" />}
        >
          Start Chat
        </Button>
      </div>
    );
  }

  // Pending application
  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="text-amber-500 h-5 w-5" />
          <p className="text-amber-600 font-medium">Application Submitted</p>
        </div>
        <Badge variant="outline" className="border-amber-500 text-amber-500">
          Pending
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Your application is currently under review. We'll notify you when the employer responds to your application.
      </p>
    </div>
  );
};

export default ApplicationStatus;
