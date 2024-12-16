import { Button } from "@/components/ui/button";
import { ApplicationWithDetails } from "@/types/applications";

interface ApplicationCardProps {
  application: ApplicationWithDetails;
  onAccept: (id: number) => Promise<void>;
  onReject: (id: number) => Promise<void>;
}

const ApplicationCard = ({ application, onAccept, onReject }: ApplicationCardProps) => {
  return (
    <div className="p-3 rounded-lg bg-muted">
      <p className="text-sm font-medium">
        {application.jobs.title}
      </p>
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
          onClick={() => onReject(application.id)}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export default ApplicationCard;