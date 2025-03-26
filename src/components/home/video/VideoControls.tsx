
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateVideoUrl } from "@/utils/videoUtils";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface VideoControlsProps {
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
}

export const VideoControls = ({ videoUrl, onVideoUrlChange }: VideoControlsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(videoUrl);
  const [isEmbedCode, setIsEmbedCode] = useState(false);

  // Auto-detect if the current video URL is an embed code
  useEffect(() => {
    if (videoUrl.includes('<iframe')) {
      setIsEmbedCode(true);
    }
  }, [videoUrl]);

  const handleSaveUrl = () => {
    // Validate URL
    if (!validateVideoUrl(tempUrl)) {
      toast({
        title: "Error",
        description: "Please enter a valid video URL or embed code. For HeyGen videos, use their embed code from the 'Share' button.",
        variant: "destructive",
      });
      return;
    }

    // Special handling for HeyGen URLs
    if (tempUrl.includes('heygen.com') && !tempUrl.includes('<iframe')) {
      toast({
        title: "HeyGen Video",
        description: "For HeyGen videos, please use the complete iframe embed code from the 'Share' button, not just the URL.",
        variant: "warning",
      });
    }

    // Check if it's an iframe code
    const containsIframe = tempUrl.includes('<iframe') && tempUrl.includes('</iframe>');
    setIsEmbedCode(containsIframe);

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
        <div className="flex flex-col gap-3 justify-center items-center">
          <div className="w-full max-w-md">
            <div className="flex mb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={!isEmbedCode ? "bg-primary/10" : ""}
                onClick={() => setIsEmbedCode(false)}
              >
                URL
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm" 
                className={`ml-2 ${isEmbedCode ? "bg-primary/10" : ""}`}
                onClick={() => setIsEmbedCode(true)}
              >
                Embed Code
              </Button>
            </div>
            
            {isEmbedCode ? (
              <Textarea
                className="min-h-[100px] font-mono text-xs"
                placeholder='<iframe src="https://app.heygen.com/embed/..." width="600" height="340" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
              />
            ) : (
              <Input
                className="w-full"
                placeholder="Enter video URL (e.g., https://example.com/video.mp4)"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
              />
            )}
          </div>
          
          <div className="flex gap-2 mt-2">
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
        Note: For videos from services like HeyGen, YouTube, or Vimeo, you should paste their embed code.
        Click "Share" on the video and look for the "Embed" option. Direct MP4 links also work.
      </p>
    </div>
  );
};
