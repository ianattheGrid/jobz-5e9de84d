
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, FileText, Check } from "lucide-react";

interface FileUploadSectionProps {
  userId: string;
  currentProfilePicture?: string | null;
  currentCV?: string | null;
  onUploadComplete?: () => void;
}

export const FileUploadSection = ({ 
  userId, 
  currentProfilePicture, 
  currentCV,
  onUploadComplete 
}: FileUploadSectionProps) => {
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<'picture' | 'cv' | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File, type: 'profile_picture' | 'cv') => {
    const isProfile = type === 'profile_picture';
    const setUploading = isProfile ? setUploadingPicture : setUploadingCV;
    const bucket = isProfile ? 'profile_pictures' : 'cvs';
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExtension}`;

    try {
      setUploading(true);
      setUploadSuccess(null);

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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-900">Profile Picture</div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="default"
            onClick={() => document.getElementById('profile-picture-input')?.click()}
            disabled={uploadingPicture}
            className="w-[200px] relative"
          >
            {uploadingPicture ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : uploadSuccess === 'picture' ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Uploaded!
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Picture
              </>
            )}
          </Button>
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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'profile_picture');
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-sm font-medium text-gray-900">CV / Resume</div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="default"
            onClick={() => document.getElementById('cv-input')?.click()}
            disabled={uploadingCV}
            className="w-[200px]"
          >
            {uploadingCV ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : uploadSuccess === 'cv' ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Uploaded!
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload CV
              </>
            )}
          </Button>
          {currentCV && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <a
                href={currentCV}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Current CV
              </a>
            </div>
          )}
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
        <div className="text-xs text-gray-500">
          Supported formats: PDF, DOC, DOCX. For best results, use PDF format with selectable text.
        </div>
      </div>
    </div>
  );
}
