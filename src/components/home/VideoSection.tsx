
import { useEffect, useRef, useState } from "react";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { extractDomain } from "@/utils/validationUtils";

export const VideoSection = () => {
  const [videoUrl, setVideoUrl] = useState("https://www.w3schools.com/html/mov_bbb.mp4");
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(videoUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [videoFormat, setVideoFormat] = useState("video/mp4");
  const videoRef = useRef<HTMLVideoElement>(null);

  // This effect will force a reload of the video element when the URL changes
  useEffect(() => {
    if (videoRef.current) {
      // Reset the video element to ensure it loads the new source
      videoRef.current.pause();
      
      // Determine video format based on URL
      const format = detectVideoFormat(videoUrl);
      setVideoFormat(format);
      
      videoRef.current.load();
      
      // Try to play the video after it's loaded
      const playVideo = () => {
        videoRef.current?.play().catch(error => {
          console.error("Video playback failed:", error);
        });
      };

      videoRef.current.addEventListener("loadeddata", playVideo, { once: true });
      
      return () => {
        videoRef.current?.removeEventListener("loadeddata", playVideo);
      };
    }
  }, [videoUrl]);

  const detectVideoFormat = (url: string): string => {
    if (url.includes('.mp4')) return 'video/mp4';
    if (url.includes('.webm')) return 'video/webm';
    if (url.includes('.ogg')) return 'video/ogg';
    if (url.includes('.mov')) return 'video/quicktime';
    
    // Default to MP4 for unknown formats
    return 'video/mp4';
  };

  const validateUrl = (url: string) => {
    if (!url.trim()) return false;
    
    // Basic URL validation
    try {
      const urlObj = new URL(url);
      const domain = extractDomain(url);
      
      // Check for known video hosts
      if (
        domain.includes('heygen') || 
        domain.includes('vimeo') || 
        domain.includes('youtube') || 
        domain.includes('loom')
      ) {
        // Known video hosting services
        // Note: These may require embed links rather than direct video links
        toast({
          title: "Video Service Detected",
          description: "Please use a direct MP4 video link. For HeyGen, download the video or get a direct link to the MP4 file.",
          variant: "default",
        });
      }
      
      // Check if URL likely points to a video
      return url.includes('.mp4') || 
             url.includes('.webm') || 
             url.includes('.mov') || 
             url.includes('.ogg') || 
             url.includes('/videos/') || 
             url.includes('video') || 
             url.includes('media');
    } catch {
      return false;
    }
  };

  const handleSaveUrl = () => {
    // Validate URL
    if (!validateUrl(tempUrl)) {
      toast({
        title: "Error",
        description: "Please enter a valid video URL. For HeyGen videos, use the direct download link to the MP4 file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setVideoUrl(tempUrl);
    setIsEditing(false);
    
    toast({
      title: "Success",
      description: "Video URL updated successfully",
    });
  };

  const handleVideoError = () => {
    toast({
      title: "Video Error",
      description: "Unable to load video from the provided URL. This may be due to CORS restrictions or the URL not being a direct video link. Please download the video and host it elsewhere, or use a direct MP4 link.",
      variant: "destructive",
    });
    setIsLoading(false);
  };

  const handleVideoLoaded = () => {
    setIsLoading(false);
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
          
          <div className="relative aspect-video mx-auto shadow-xl rounded-lg overflow-hidden bg-black">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <video 
              ref={videoRef}
              className="w-full h-full object-contain" 
              controls
              poster="/placeholder.svg"
              onError={handleVideoError}
              onLoadedData={handleVideoLoaded}
              playsInline
            >
              <source src={videoUrl} type={videoFormat} />
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
              Note: Enter a direct link to an MP4 video file. For HeyGen videos, you may need to download the video first and host it elsewhere due to cross-origin restrictions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
