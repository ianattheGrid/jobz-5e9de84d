
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApplicationWithDetails } from "@/types/applications";
import { UserCheck } from "lucide-react";
import RejectionDialog from "./RejectionDialog";
import { ScheduleInterviewDialog } from "../interviews/ScheduleInterviewDialog";
import { useAuth } from "@/hooks/useAuth";

interface ApplicationCardProps {
  application: ApplicationWithDetails;
  onAccept: (id: number) => Promise<void>;
  onReject: (id: number, reason: string, notes?: string) => Promise<void>;
}

const ApplicationCard = ({ application, onAccept, onReject }: ApplicationCardProps) => {
  const { user } = useAuth();
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const handleReject = async (reason: string, notes?: string) => {
    await onReject(application.id, reason, notes);
  };

  return (
    <div className="p-3 rounded-lg bg-muted">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">
          {application.jobs.title}
        </p>
        {application.vrRecommendation && (
          <div className="flex items-center text-xs text-pink-600 font-medium">
            <UserCheck className="h-3.5 w-3.5 mr-1" />
            <span>VR Recommended</span>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        {application.candidate_profiles ? 
          `Candidate: ${application.candidate_profiles.job_title} with ${application.candidate_profiles.years_experience} years experience`
          : 'Candidate profile not available'
        }
      </p>
      <div className="mt-2 flex gap-2">
        <Button
          size="sm"
          variant="default"
          onClick={() => onAccept(application.id)}
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowScheduleDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Schedule Interview
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowRejectionDialog(true)}
        >
          Reject
        </Button>
      </div>

      <RejectionDialog
        isOpen={showRejectionDialog}
        onClose={() => setShowRejectionDialog(false)}
        onConfirm={handleReject}
        candidateName={application.candidate_profiles?.job_title}
        jobTitle={application.jobs.title}
      />
      
      {user && (
        <ScheduleInterviewDialog
          isOpen={showScheduleDialog}
          onOpenChange={setShowScheduleDialog}
          applicationId={application.id}
          candidateId={application.applicant_id}
          employerId={user.id}
          jobTitle={application.jobs.title}
        />
      )}
    </div>
  );
};

export default ApplicationCard;
