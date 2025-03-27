
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ApplicationFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  setCoverLetter: (value: string) => void;
  setResumeFile: (file: File | null) => void;
  coverLetter: string;
  referenceCode?: string;
}

const ApplicationForm = ({ 
  onSubmit, 
  onCancel, 
  setCoverLetter, 
  setResumeFile,
  coverLetter,
  referenceCode
}: ApplicationFormProps) => {
  return (
    <form onSubmit={onSubmit} onClick={(e) => e.stopPropagation()} className="space-y-4">
      {referenceCode && (
        <div className="p-3 bg-primary/10 rounded-md">
          <p className="text-sm font-medium text-primary flex items-center">
            <span className="mr-1">Reference Code:</span>
            {referenceCode}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Please include this reference code in any communications about this position.
          </p>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1 text-red-800">Resume (Optional)</label>
        <Input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-red-800">Cover Letter</label>
        <Textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Write your cover letter..."
          className="h-32"
        />
      </div>
      <div className="flex space-x-2">
        <Button 
          type="submit" 
          className="flex-1 bg-red-800 hover:bg-red-900"
        >
          Submit Application
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          className="border-red-800 text-red-800 hover:bg-red-50"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ApplicationForm;
