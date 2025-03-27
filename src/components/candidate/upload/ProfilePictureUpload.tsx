
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileUploadButton } from "./FileUploadButton";
import { DeleteFileButton } from "./DeleteFileButton";

interface ProfilePictureUploadProps {
  currentProfilePicture: string | null;
  uploadingPicture: boolean;
  deletingPicture: boolean;
  uploadSuccess: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

export const ProfilePictureUpload = ({
  currentProfilePicture,
  uploadingPicture,
  deletingPicture,
  uploadSuccess,
  onUpload,
  onDelete
}: ProfilePictureUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };
  
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-900">Profile Picture</div>
      <div className="flex items-center gap-4">
        <FileUploadButton
          id="profile-picture-input"
          uploading={uploadingPicture}
          success={uploadSuccess}
          onButtonClick={() => document.getElementById('profile-picture-input')?.click()}
          label="Upload Picture"
          accept="image/*"
          disabled={deletingPicture}
        />

        {currentProfilePicture && (
          <DeleteFileButton
            deleting={deletingPicture}
            onDelete={onDelete}
            disabled={uploadingPicture}
          />
        )}

        <Avatar className="h-20 w-20">
          <AvatarImage src={currentProfilePicture || undefined} />
          <AvatarFallback className="bg-gray-200 text-gray-500">
            {/* Add initials or icon here if needed */}
          </AvatarFallback>
        </Avatar>
        
        <input
          type="file"
          id="profile-picture-input"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
