
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateVideoUrl } from "@/utils/videoUtils";
import { toast } from "@/hooks/use-toast";

interface VideoControlsProps {
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
}

export const VideoControls = ({ videoUrl, onVideoUrlChange }: VideoControlsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(videoUrl);

  const handleSaveUrl = () => {
    // Validate URL
    if (!validateVideoUrl(tempUrl)) {
      toast({
        title: "Error",
        description: "Please enter a valid video URL. For HeyGen videos, you may need to use their embed code or download the video.",
        variant: "destructive",
      });
      return;
    }

    onVideoUrlChange(tempUrl);
    setIsEditing(false);
    
    toast({
      title: "Success",
      description: "Video URL updated successfully",
    });
  };

  return (
    <div className="mt-6">
      {isEditing ? (
        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
          <Input
            className="max-w-md"
            placeholder="Enter video URL or embed code"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
          />
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button 
              onClick={handleSaveUrl}
              variant="default"
              className="px-4 py-2 bg-primary text-white hover:bg-primary/90 z-10 relative"
              type="button"
            >
              Save
            </Button>
            <Button 
              variant="outline"
              type="button"
              className="z-10 relative"
              onClick={() => {
                setTempUrl(videoUrl);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => setIsEditing(true)}
          className="text-sm"
        >
          Change Video URL
        </Button>
      )}
      <p className="mt-4 text-sm text-muted-foreground">
        Note: For videos from services like HeyGen, YouTube, or Vimeo, you may need to use their embed code
        due to cross-origin restrictions. Direct MP4 links also work.
      </p>
    </div>
  );
};
