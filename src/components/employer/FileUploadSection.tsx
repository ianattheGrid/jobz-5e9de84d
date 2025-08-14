
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Trash2, Plus, Building2, User } from "lucide-react";
import { CompanyGallerySection } from "./CompanyGallerySection";

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

    console.log('Starting upload:', { fileName, type, fileSize: file.size });

    try {
      setUploading(true);

      const { error: uploadError, data } = await supabase.storage
        .from('company_assets')
        .upload(fileName, file, {
          upsert: true,
        });

      console.log('Upload result:', { uploadError, data });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('company_assets')
        .getPublicUrl(fileName);

      console.log('Public URL:', urlData.publicUrl);

      const { error: updateError } = await supabase
        .from('employer_profiles')
        .update({
          [isProfile ? 'profile_picture_url' : 'company_logo_url']: urlData.publicUrl,
        })
        .eq('id', userId);

      console.log('Database update result:', { updateError });

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `${isProfile ? 'Profile picture' : 'Company logo'} uploaded successfully`,
      });

      console.log('Upload completed successfully');
      
      // Instead of reloading, let's update the parent component state
      window.location.reload();
    } catch (error: any) {
      console.error('Upload error:', error);
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
    <div className="space-y-8">
      <h3 className="text-xl font-semibold border-l-4 border-primary pl-4">Company Assets & Gallery</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Picture Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-base font-medium text-gray-900">
            <User className="h-5 w-5 text-primary" />
            Your Profile Picture
          </div>
          <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentProfilePicture || undefined} />
              <AvatarFallback className="bg-gray-200 text-gray-400">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('profile-picture-input')?.click()}
                disabled={uploadingPicture || deletingPicture}
                className="bg-white"
              >
                {uploadingPicture ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {currentProfilePicture ? 'Change' : 'Upload'}
              </Button>

              {currentProfilePicture && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFileDelete('profile_picture')}
                  disabled={uploadingPicture || deletingPicture}
                  className="bg-white text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {deletingPicture ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Professional headshot recommended<br />
              JPG, PNG up to 5MB
            </p>
          </div>

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

        {/* Company Logo Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-base font-medium text-gray-900">
            <Building2 className="h-5 w-5 text-primary" />
            Company Logo
          </div>
          
          <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentCompanyLogo || undefined} />
              <AvatarFallback className="bg-gray-200 text-gray-400">
                <Building2 className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('company-logo-input')?.click()}
                disabled={uploadingLogo || deletingLogo}
                className="bg-white"
              >
                {uploadingLogo ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {currentCompanyLogo ? 'Change' : 'Upload'}
              </Button>

              {currentCompanyLogo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFileDelete('company_logo')}
                  disabled={uploadingLogo || deletingLogo}
                  className="bg-white text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {deletingLogo ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Square logo works best<br />
              JPG, PNG up to 5MB
            </p>
          </div>

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

      {/* Company Gallery Section */}
      <CompanyGallerySection employerId={userId} />
    </div>
  );
};
