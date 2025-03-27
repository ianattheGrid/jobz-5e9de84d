
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useState } from "react";

type VerificationUploadDialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  verificationServiceName: string;
  setVerificationServiceName: (name: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadVerificationDocument: () => Promise<void>;
  uploadLoading: boolean;
  verificationFile: File | null;
};

export const VerificationUploadDialog = ({
  dialogOpen,
  setDialogOpen,
  verificationServiceName,
  setVerificationServiceName,
  handleFileChange,
  uploadVerificationDocument,
  uploadLoading,
  verificationFile
}: VerificationUploadDialogProps) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Verification Document</DialogTitle>
          <DialogDescription>
            After completing verification with your chosen service, upload proof of verification here.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="service-name">Verification Service Name</Label>
            <Input 
              id="service-name" 
              placeholder="e.g., Veriff, Onfido, Persona" 
              value={verificationServiceName}
              onChange={(e) => setVerificationServiceName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="verification-doc">Verification Document</Label>
            <Input 
              id="verification-doc" 
              type="file" 
              onChange={handleFileChange} 
              className="cursor-pointer"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="text-xs text-gray-500">
              Upload PDF or image of your verification certificate or confirmation
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={uploadVerificationDocument}
            disabled={uploadLoading || !verificationFile}
            className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
          >
            {uploadLoading ? "Uploading..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
