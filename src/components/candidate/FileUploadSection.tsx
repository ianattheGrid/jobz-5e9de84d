
import React from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { ProfilePictureUpload } from "./upload/ProfilePictureUpload";
import { CVUpload } from "./upload/CVUpload";

interface FileUploadSectionProps {
  userId: string;
  currentProfilePicture?: string | null;
  currentCV?: string | null;
  onUploadComplete?: () => void;
  showProfilePicture?: boolean;
  showCV?: boolean;
}

export const FileUploadSection = ({ 
  userId, 
  currentProfilePicture, 
  currentCV,
  onUploadComplete,
  showProfilePicture = true,
  showCV = true
}: FileUploadSectionProps) => {
  const {
    uploadingPicture,
    uploadingCV,
    deletingPicture,
    deletingCV,
    uploadSuccess,
    handleFileUpload,
    handleFileDelete
  } = useFileUpload({
    userId,
    onUploadComplete
  });

  return (
    <div className="space-y-6">
      {showProfilePicture && (
        <ProfilePictureUpload
          currentProfilePicture={currentProfilePicture || null}
          uploadingPicture={uploadingPicture}
          deletingPicture={deletingPicture}
          uploadSuccess={uploadSuccess === 'picture'}
          onUpload={(file) => handleFileUpload(file, 'profile_picture')}
          onDelete={() => handleFileDelete('profile_picture', currentProfilePicture || null)}
        />
      )}

      {showCV && (
        <CVUpload
          currentCV={currentCV || null}
          uploadingCV={uploadingCV}
          deletingCV={deletingCV}
          uploadSuccess={uploadSuccess === 'cv'}
          onUpload={(file) => handleFileUpload(file, 'cv')}
          onDelete={() => handleFileDelete('cv', currentCV || null)}
        />
      )}
    </div>
  );
};
