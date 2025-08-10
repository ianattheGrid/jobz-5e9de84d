
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type FileType = 'profile_picture' | 'cv';

interface UseFileUploadProps {
  userId: string;
  onUploadComplete?: () => void;
}

export const useFileUpload = ({ userId, onUploadComplete }: UseFileUploadProps) => {
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [deletingPicture, setDeletingPicture] = useState(false);
  const [deletingCV, setDeletingCV] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<'picture' | 'cv' | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File, type: FileType) => {
    console.log('Starting file upload:', { fileName: file.name, fileSize: file.size, type });
    
    const isProfile = type === 'profile_picture';
    const setUploading = isProfile ? setUploadingPicture : setUploadingCV;
    const bucket = isProfile ? 'profile_pictures' : 'cvs';

    // Validate file size (5MB for profile pictures, 10MB for CVs)
    const maxSize = isProfile ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `File size must be less than ${maxSize / (1024 * 1024)}MB`,
      });
      return;
    }

    // Validate file type for profile pictures
    if (isProfile && !file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Profile picture must be an image file",
      });
      return;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${userId}/${Date.now()}.${fileExtension}`;

    try {
      setUploading(true);
      setUploadSuccess(null);

      console.log('Uploading to bucket:', bucket, 'with path:', fileName);

      // Upload file to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData);

      if (isProfile) {
        // Get public URL for profile pictures (bucket is public)
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        console.log('Public URL generated:', urlData.publicUrl);

        // Update candidate profile with new profile picture URL
        const { error: updateError } = await supabase
          .from('candidate_profiles')
          .update({
            profile_picture_url: urlData.publicUrl,
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Profile update error:', updateError);
          throw updateError;
        }
      } else {
        // Store private path (not a public URL) for CVs
        const { error: updateError } = await supabase
          .from('candidate_profiles')
          .update({
            cv_url: fileName,
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Profile update error:', updateError);
          throw updateError;
        }
      }


      console.log('Profile updated successfully');

      // Show success indicator
      setUploadSuccess(isProfile ? 'picture' : 'cv');
      
      // Clear success indicator after 2 seconds
      setTimeout(() => {
        setUploadSuccess(null);
      }, 2000);

      toast({
        title: "Success",
        description: `${isProfile ? 'Profile picture' : 'CV'} uploaded successfully`,
      });

      // Call the onUploadComplete callback if provided
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error: any) {
      console.error('File upload failed:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || `Failed to upload ${isProfile ? 'profile picture' : 'CV'}. Please try again.`,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (type: FileType, currentFile: string | null) => {
    if (!currentFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No ${type === 'profile_picture' ? 'profile picture' : 'CV'} to delete`,
      });
      return;
    }
    
    const isProfile = type === 'profile_picture';
    const setDeleting = isProfile ? setDeletingPicture : setDeletingCV;

    try {
      setDeleting(true);

      // Determine bucket and file path (supports stored path or legacy public URL)
      const isUrl = currentFile.startsWith('http');
      let bucket = isProfile ? 'profile_pictures' : 'cvs';
      let filePath = currentFile;

      if (isUrl) {
        const urlParts = currentFile.split('/');
        const bucketIdx = urlParts.findIndex(part => part === 'profile_pictures' || part === 'cvs');
        if (bucketIdx === -1) {
          throw new Error('Invalid file URL format');
        }
        bucket = urlParts[bucketIdx];
        filePath = urlParts.slice(bucketIdx + 1).join('/');
      }

      console.log('Deleting file:', { bucket, filePath });

      // First, update the profile to remove the reference
      const { error: updateError } = await supabase
        .from('candidate_profiles')
        .update({
          [isProfile ? 'profile_picture_url' : 'cv_url']: null,
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Then, try to remove the actual file from storage
      try {
        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove([filePath]);
        
        if (deleteError) {
          console.error("Storage delete error:", deleteError);
        }
      } catch (storageError) {
        console.error("Storage delete error:", storageError);
        // Don't throw here, we still want to show success since the profile was updated
      }

      toast({
        title: "Success",
        description: `${isProfile ? 'Profile picture' : 'CV'} deleted successfully`,
      });

      // Call the onUploadComplete callback if provided
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error: any) {
      console.error('File deletion failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to delete ${isProfile ? 'profile picture' : 'CV'}`,
      });
    } finally {
      setDeleting(false);
    }
  };

  return {
    uploadingPicture,
    uploadingCV,
    deletingPicture,
    deletingCV,
    uploadSuccess,
    handleFileUpload,
    handleFileDelete
  };
};
