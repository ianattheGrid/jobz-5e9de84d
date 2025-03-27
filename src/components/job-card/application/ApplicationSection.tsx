
import { Button } from "@/components/ui/button";
import ApplicationForm from "./ApplicationForm";

interface ApplicationSectionProps {
  jobId: number;
  employerId: string;
  onStartApply: (e: React.MouseEvent) => Promise<void>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  coverLetter: string;
  setCoverLetter: (value: string) => void;
  setResumeFile: (file: File | null) => void;
  isApplying: boolean;
  setIsApplying: (value: boolean) => void;
}

const ApplicationSection = ({
  jobId,
  employerId,
  onStartApply,
  onSubmit,
  coverLetter,
  setCoverLetter,
  setResumeFile,
  isApplying,
  setIsApplying,
}: ApplicationSectionProps) => {
  return (
    <div className="mt-6">
      {!isApplying ? (
        <Button 
          className="w-1/2 mx-auto block bg-primary hover:bg-primary/90 text-white"
          onClick={onStartApply}
          size="sm"
        >
          Apply
        </Button>
      ) : (
        <ApplicationForm
          onSubmit={onSubmit}
          onCancel={() => setIsApplying(false)}
          setCoverLetter={setCoverLetter}
          setResumeFile={setResumeFile}
          coverLetter={coverLetter}
        />
      )}
    </div>
  );
};

export default ApplicationSection;
