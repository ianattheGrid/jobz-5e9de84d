import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";
import { FormLabel } from "@/components/ui/form";

interface FileUploadSectionProps {
  userId: string;
  currentProfilePicture?: string | null;
  currentCV?: string | null;
}

export const FileUploadSection = ({ userId, currentProfilePicture, currentCV }: FileUploadSectionProps) => {
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File, type: 'profile_picture' | 'cv') => {
    const isProfile = type === 'profile_picture';
    const setUploading = isProfile ? setUploadingPicture : setUploadingCV;
    const bucket = isProfile ? 'profile_pictures' : 'cvs';
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExtension}`;

    try {
      setUploading(true);

      const { error: uploadError, data } = await supabase.storage
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

      toast({
        title: "Success",
        description: `${isProfile ? 'Profile picture' : 'CV'} uploaded successfully`,
      });

      // Reload the page to show the new file
      window.location.reload();
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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormLabel>Profile Picture</FormLabel>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={currentProfilePicture || undefined} />
            <AvatarFallback>PP</AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            onClick={() => document.getElementById('profile-picture-input')?.click()}
            disabled={uploadingPicture}
          >
            {uploadingPicture ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Picture
          </Button>
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
        <FormLabel>CV / Resume</FormLabel>
        <div className="flex items-center gap-4">
          {currentCV && (
            <a
              href={currentCV}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View Current CV
            </a>
          )}
          <Button
            variant="outline"
            onClick={() => document.getElementById('cv-input')?.click()}
            disabled={uploadingCV}
          >
            {uploadingCV ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload CV
          </Button>
          <input
            type="file"
            id="cv-input"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'cv');
            }}
          />
        </div>
      </div>
    </div>
  );
};