
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Check } from "lucide-react";

interface FileUploadButtonProps {
  id: string;
  uploading: boolean;
  success: boolean;
  onButtonClick: () => void;
  label: string;
  accept?: string;
  disabled?: boolean;
}

export const FileUploadButton = ({
  uploading,
  success,
  onButtonClick,
  label,
  disabled = false
}: FileUploadButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="default"
      onClick={onButtonClick}
      disabled={uploading || disabled}
      className="w-[200px] relative"
    >
      {uploading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Uploading...
        </>
      ) : success ? (
        <>
          <Check className="h-4 w-4 mr-2 text-green-500" />
          Uploaded!
        </>
      ) : (
        <>
          <Upload className="h-4 w-4 mr-2" />
          {label}
        </>
      )}
    </Button>
  );
};
