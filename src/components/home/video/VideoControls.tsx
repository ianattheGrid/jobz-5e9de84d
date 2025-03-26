
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateVideoUrl, cleanUpEmbedCode, hasCompleteHeyGenEmbed, isHeyGenVideo } from "@/utils/videoUtils";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoControlsProps {
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
}

export const VideoControls = ({ videoUrl, onVideoUrlChange }: VideoControlsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(videoUrl);
  const [inputType, setInputType] = useState<'url' | 'embed'>('url');
  const [defaultTab, setDefaultTab] = useState<'url' | 'embed'>('url');

  // Auto-detect if the current video URL is an embed code
  useEffect(() => {
    if (videoUrl.includes('<iframe')) {
      setInputType('embed');
      setDefaultTab('embed');
    } else {
      setInputType('url');
      setDefaultTab('url');
    }
    
    setTempUrl(videoUrl);
  }, [videoUrl]);

  const handleValidation = useCallback(() => {
    // Check if URL/embed code is empty
    if (!tempUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a video URL or embed code.",
        variant: "destructive",
      });
      return false;
    }

    // Validate URL
    if (!validateVideoUrl(tempUrl)) {
      toast({
        title: "Error",
        description: "Please enter a valid video URL or embed code. For HeyGen videos, use their embed code from the 'Share' button.",
        variant: "destructive",
      });
      return false;
    }

    // Only show the HeyGen warning if:
    // 1. It's a HeyGen URL (not a complete embed code)
    // 2. It doesn't have a complete iframe tag
    if (isHeyGenVideo(tempUrl) && !hasCompleteHeyGenEmbed(tempUrl)) {
      toast({
        title: "HeyGen Video",
        description: "For HeyGen videos, please use the complete iframe embed code from the 'Share' button, not just the URL.",
        variant: "default",
      });
    }

    return true;
  }, [tempUrl]);

  const handleSaveUrl = () => {
    if (!handleValidation()) {
      return;
    }

    // Clean up embed code if needed
    const finalUrl = inputType === 'embed' ? cleanUpEmbedCode(tempUrl) : tempUrl;
    
    onVideoUrlChange(finalUrl);
    setIsEditing(false);
    
    toast({
      title: "Success",
      description: "Video URL updated successfully",
    });
  };

  const handleTabChange = (value: string) => {
    setInputType(value as 'url' | 'embed');
  };

  return (
    <div className="mt-6">
      {isEditing ? (
        <div className="flex flex-col gap-3 justify-center items-center">
          <div className="w-full max-w-md">
            <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="embed">Embed Code</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="w-full">
                <Input
                  className="w-full"
                  placeholder="Enter video URL (YouTube, Vimeo, or MP4 link)"
                  value={inputType === 'url' ? tempUrl : ''}
                  onChange={(e) => setTempUrl(e.target.value)}
                  autoFocus
                />
              </TabsContent>
              
              <TabsContent value="embed" className="w-full">
                <Textarea
                  className="min-h-[120px] font-mono text-xs"
                  placeholder='<iframe src="https://player.vimeo.com/video/123456789" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'
                  value={inputType === 'embed' ? tempUrl : ''}
                  onChange={(e) => setTempUrl(e.target.value)}
                  autoFocus
                />
              </TabsContent>
            </Tabs>
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
        Note: For videos from services like YouTube or Vimeo, you can use their URLs directly or paste embed codes.
        For HeyGen videos, please paste the complete iframe embed code from the "Share" button.
      </p>
    </div>
  );
};
