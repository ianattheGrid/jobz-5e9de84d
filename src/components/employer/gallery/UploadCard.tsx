
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
    <Card className="border-dashed border-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
      <CardContent className="p-0">
        <label className="flex flex-col items-center justify-center w-full h-36 cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <div className="animate-pulse">Uploading...</div>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP (max. 5MB)</p>
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
