
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
  id,
  uploading,
  success,
  onButtonClick,
  label,
  accept = "*/*",
  disabled = false
}: FileUploadButtonProps) => {
  return (
    <>
      <Button
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
      
      <input
        type="file"
        id={id}
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            // This will be handled by the parent component
          }
        }}
      />
    </>
  );
};
