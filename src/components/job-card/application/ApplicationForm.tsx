
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Hash } from "lucide-react";

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
        <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-primary">
              Reference Code: {referenceCode}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Please include this reference code in any communications about this position.
          </p>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Resume (Optional)</label>
        <Input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
          className="bg-white text-foreground"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Cover Letter</label>
        <Textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Write your cover letter..."
          className="h-32 bg-white text-foreground"
        />
      </div>
      <div className="flex space-x-2">
        <Button 
          type="submit" 
          className="flex-1 bg-primary hover:bg-primary/90 text-white"
        >
          Submit Application
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          className="border-primary text-primary hover:bg-primary/10"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ApplicationForm;
