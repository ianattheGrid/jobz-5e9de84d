
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Trash2 } from "lucide-react";

interface FileUploadSectionProps {
  userId: string;
  currentProfilePicture?: string | null;
  currentCompanyLogo?: string | null;
}

export const FileUploadSection = ({ userId, currentProfilePicture, currentCompanyLogo }: FileUploadSectionProps) => {
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [deletingPicture, setDeletingPicture] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File, type: 'profile_picture' | 'company_logo') => {
    const isProfile = type === 'profile_picture';
    const setUploading = isProfile ? setUploadingPicture : setUploadingLogo;
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExtension}`;

    try {
      setUploading(true);

      const { error: uploadError, data } = await supabase.storage
        .from('company_assets')
        .upload(fileName, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('company_assets')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('employer_profiles')
        .update({
          [isProfile ? 'profile_picture_url' : 'company_logo_url']: urlData.publicUrl,
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `${isProfile ? 'Profile picture' : 'Company logo'} uploaded successfully`,
      });

      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to upload ${isProfile ? 'profile picture' : 'company logo'}`,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (type: 'profile_picture' | 'company_logo') => {
    const isProfile = type === 'profile_picture';
    const currentFile = isProfile ? currentProfilePicture : currentCompanyLogo;
    const setDeleting = isProfile ? setDeletingPicture : setDeletingLogo;
    
    if (!currentFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No ${isProfile ? 'profile picture' : 'company logo'} to delete`,
      });
      return;
    }

    try {
      setDeleting(true);

      // Extract the file path from the URL
      const urlParts = currentFile.split('/');
      const bucketIndex = urlParts.indexOf('public') + 1;
      
      if (bucketIndex > 0 && bucketIndex < urlParts.length) {
        const bucket = urlParts[bucketIndex];
        const filePath = urlParts.slice(bucketIndex + 1).join('/');

        // Update the profile to remove the reference
        const { error: updateError } = await supabase
          .from('employer_profiles')
          .update({
            [isProfile ? 'profile_picture_url' : 'company_logo_url']: null,
          })
          .eq('id', userId);

        if (updateError) throw updateError;

        // Try to remove the actual file from storage
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
          description: `${isProfile ? 'Profile picture' : 'Company logo'} deleted successfully`,
        });

        window.location.reload();
      } else {
        throw new Error(`Invalid URL format for ${isProfile ? 'profile picture' : 'company logo'}`);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to delete ${isProfile ? 'profile picture' : 'company logo'}`,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="text-sm font-medium">Profile Picture</div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById('profile-picture-input')?.click()}
            disabled={uploadingPicture || deletingPicture}
            className="w-[200px]"
          >
            {uploadingPicture ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Picture
          </Button>

          {currentProfilePicture && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleFileDelete('profile_picture')}
              disabled={uploadingPicture || deletingPicture}
              className="bg-red-50 hover:bg-red-100 border-red-200"
              title="Delete profile picture"
            >
              {deletingPicture ? (
                <Loader2 className="h-4 w-4 animate-spin text-red-500" />
              ) : (
                <Trash2 className="h-4 w-4 text-red-500" />
              )}
            </Button>
          )}

          <Avatar className="h-20 w-20">
            <AvatarImage src={currentProfilePicture || undefined} />
            <AvatarFallback>{/* Intentionally left blank */}</AvatarFallback>
          </Avatar>
          <input
            type="file"
            id="profile-picture-input"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'profile_picture');
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-sm font-medium">Company Logo</div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById('company-logo-input')?.click()}
            disabled={uploadingLogo || deletingLogo}
            className="w-[200px]"
          >
            {uploadingLogo ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Logo
          </Button>

          {currentCompanyLogo && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleFileDelete('company_logo')}
              disabled={uploadingLogo || deletingLogo}
              className="bg-red-50 hover:bg-red-100 border-red-200"
              title="Delete company logo"
            >
              {deletingLogo ? (
                <Loader2 className="h-4 w-4 animate-spin text-red-500" />
              ) : (
                <Trash2 className="h-4 w-4 text-red-500" />
              )}
            </Button>
          )}

          <Avatar className="h-20 w-20">
            <AvatarImage src={currentCompanyLogo || undefined} />
            <AvatarFallback>{/* Intentionally left blank */}</AvatarFallback>
          </Avatar>
          <input
            type="file"
            id="company-logo-input"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'company_logo');
            }}
          />
        </div>
      </div>
    </div>
  );
};
