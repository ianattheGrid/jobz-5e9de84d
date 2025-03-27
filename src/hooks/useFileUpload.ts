
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
    const isProfile = type === 'profile_picture';
    const setUploading = isProfile ? setUploadingPicture : setUploadingCV;
    const bucket = isProfile ? 'profile_pictures' : 'cvs';
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExtension}`;

    try {
      setUploading(true);
      setUploadSuccess(null);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('candidate_profiles')
        .update({
          [isProfile ? 'profile_picture_url' : 'cv_url']: urlData.publicUrl,
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Show success indicator
      setUploadSuccess(isProfile ? 'picture' : 'cv');
      
      // Set timeout to clear success indicator after 2 seconds
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
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to upload ${isProfile ? 'profile picture' : 'CV'}`,
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

      // Extract the file path from the URL
      const urlParts = currentFile.split('/');
      const bucketIndex = urlParts.indexOf('public') + 1;
      if (bucketIndex > 0 && bucketIndex < urlParts.length) {
        const bucket = urlParts[bucketIndex];
        const filePath = urlParts.slice(bucketIndex + 1).join('/');

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
          await supabase.storage
            .from(bucket)
            .remove([filePath]);
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
      } else {
        throw new Error(`Invalid URL format for ${isProfile ? 'profile picture' : 'CV'}`);
      }
    } catch (error: any) {
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
