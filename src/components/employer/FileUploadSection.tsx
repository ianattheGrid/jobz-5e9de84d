
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";
import { FormLabel } from "@/components/ui/form";

interface FileUploadSectionProps {
  userId: string;
  currentProfilePicture?: string | null;
  currentCompanyLogo?: string | null;
}

export const FileUploadSection = ({ userId, currentProfilePicture, currentCompanyLogo }: FileUploadSectionProps) => {
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
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

      // Reload the page to show the new file
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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormLabel>Profile Picture</FormLabel>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById('profile-picture-input')?.click()}
            disabled={uploadingPicture}
            className="w-[200px]"
          >
            {uploadingPicture ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Picture
          </Button>
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
        <FormLabel>Company Logo</FormLabel>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById('company-logo-input')?.click()}
            disabled={uploadingLogo}
            className="w-[200px]"
          >
            {uploadingLogo ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Logo
          </Button>
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
