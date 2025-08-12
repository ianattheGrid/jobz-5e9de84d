
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

interface UploadCardProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export function UploadCard({ onUpload, isUploading }: UploadCardProps) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    await onUpload(file);
    
    // Reset the file input
    if (event.target) event.target.value = '';
  };

  return (
    <Card className="border-dashed border-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer h-full">
      <CardContent className="p-0 h-full">
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer aspect-square">{" "}
          <div className="flex flex-col items-center justify-center p-4 text-center">
            {isUploading ? (
              <div className="animate-pulse text-sm">Uploading...</div>
            ) : (
              <>
                <ImageIcon className="w-6 h-6 mb-2 text-gray-400" />
                <p className="text-xs text-gray-500 font-semibold mb-1">Click to upload</p>
                <p className="text-xs text-gray-400">PNG, JPG or WEBP</p>
              </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </CardContent>
    </Card>
  );
}
