import { Button } from "@/components/ui/button";
import { useState } from "react";
import ApplicationForm from "./ApplicationForm";

interface ApplicationSectionProps {
  onStartApply: (e: React.MouseEvent) => Promise<void>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  coverLetter: string;
  setCoverLetter: (value: string) => void;
  setResumeFile: (file: File | null) => void;
}

const ApplicationSection = ({
  onStartApply,
  onSubmit,
  coverLetter,
  setCoverLetter,
  setResumeFile,
}: ApplicationSectionProps) => {
  const [isApplying, setIsApplying] = useState(false);

  const handleStartApply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onStartApply(e);
  };

  return (
    <div className="mt-6">
      {!isApplying ? (
        <Button 
          className="w-1/2 mx-auto block bg-red-800 hover:bg-red-900 text-white"
          onClick={handleStartApply}
          size="sm"
        >
          Apply Now
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