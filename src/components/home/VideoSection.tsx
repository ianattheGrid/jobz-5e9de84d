
import { useEffect, useRef, useState } from "react";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export const VideoSection = () => {
  const [videoUrl, setVideoUrl] = useState("https://www.w3schools.com/html/mov_bbb.mp4");
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(videoUrl);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Update video source when videoUrl changes
    if (videoRef.current) {
      videoRef.current.load(); // Reload video element with new source
    }
  }, [videoUrl]);

  const handleSaveUrl = () => {
    // Validate URL
    if (!tempUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setVideoUrl(tempUrl);
    setIsEditing(false);
    
    toast({
      title: "Success",
      description: "Video URL updated successfully",
    });
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl font-bold mb-6 ${PRIMARY_COLOR_PATTERN}`}>
            See How It Works
          </h2>
          <p className="text-foreground mb-8">
            Watch our short explainer video to understand how jobz can transform your hiring experience.
          </p>
          
          <div className="relative aspect-video mx-auto shadow-xl rounded-lg overflow-hidden">
            <video 
              ref={videoRef}
              className="w-full h-full object-cover" 
              controls
              poster="/placeholder.svg"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="mt-6">
            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                <Input
                  className="max-w-md"
                  placeholder="Enter video URL (MP4 format)"
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
              Note: Enter a direct link to an MP4 video file, such as one from HeyGen or another video hosting service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
