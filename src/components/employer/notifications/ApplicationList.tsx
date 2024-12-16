import { ApplicationWithDetails } from "@/types/applications";
import ApplicationCard from "./ApplicationCard";

interface ApplicationListProps {
  applications: ApplicationWithDetails[];
  onAccept: (id: number) => Promise<void>;
  onReject: (id: number) => Promise<void>;
}

const ApplicationList = ({ applications, onAccept, onReject }: ApplicationListProps) => {
  if (applications.length === 0) {
    return <p className="text-sm text-muted-foreground">No new applications</p>;
  }

  return (
    <div className="space-y-2">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}
    </div>
  );
};

export default ApplicationList;