
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
  const [isEmbedded, setIsEmbedded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // This effect will process the video URL when it changes
  useEffect(() => {
    processVideoUrl(videoUrl);
  }, [videoUrl]);

  const processVideoUrl = (url: string) => {
    setIsLoading(true);
    
    // Check if this is a direct video file or needs to be embedded
    const domain = extractDomain(url);
    const isHeyGenOrServiceUrl = 
      domain.includes('heygen') || 
      domain.includes('vimeo') || 
      domain.includes('youtube') || 
      domain.includes('loom');
    
    // If it's a service URL but doesn't end with a video extension, treat as embedded
    const isVideoFile = 
      url.endsWith('.mp4') || 
      url.endsWith('.webm') || 
      url.endsWith('.mov') || 
      url.endsWith('.ogg');
    
    setIsEmbedded(isHeyGenOrServiceUrl && !isVideoFile);
    
    // For direct video files, handle with the video element
    if (!isEmbedded) {
      const format = detectVideoFormat(url);
      setVideoFormat(format);
      
      // For direct video files, let the video element handle it
      if (videoRef.current) {
        videoRef.current.pause();
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
    } else {
      // For embedded videos, we can remove the loading state sooner
      setIsLoading(false);
    }
  };

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
      
      // Check for HeyGen and other video services
      if (domain.includes('heygen')) {
        // For HeyGen, provide specific guidance
        toast({
          title: "HeyGen Video Detected",
          description: "HeyGen videos often have CORS restrictions. You can use their embed code or download the video and host it elsewhere.",
          variant: "default",
        });
        
        // HeyGen URLs can be valid, so don't reject them
        return true;
      } else if (
        domain.includes('vimeo') || 
        domain.includes('youtube') || 
        domain.includes('loom')
      ) {
        // For other video services, give general guidance
        toast({
          title: "Video Service Detected",
          description: "For best results, use the embed URL or iframe code from the service.",
          variant: "default",
        });
        return true;
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
        description: "Please enter a valid video URL. For HeyGen videos, you may need to use their embed code or download the video.",
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
      description: "Unable to load video from the provided URL. This may be due to CORS restrictions or the URL not being a direct video link. For HeyGen videos, try using the embed code or download the video.",
      variant: "destructive",
    });
    setIsLoading(false);
  };

  const handleVideoLoaded = () => {
    setIsLoading(false);
  };

  // Helper function to create an embedded iframe with proper URL
  const getEmbedUrl = (url: string) => {
    const domain = extractDomain(url);
    
    // Handle different video services
    if (domain.includes('youtube')) {
      // Convert YouTube watch URLs to embed URLs
      const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      return ytMatch ? `https://www.youtube.com/embed/${ytMatch[1]}` : url;
    } else if (domain.includes('vimeo')) {
      // Convert Vimeo URLs to embed URLs
      const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
      return vimeoMatch ? `https://player.vimeo.com/video/${vimeoMatch[1]}` : url;
    } else if (domain.includes('heygen')) {
      // For HeyGen, we'll just use the URL as is if it already contains embed
      return url.includes('embed') ? url : url;
    }
    
    // Default case, just use the URL as is
    return url;
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
          
          <div className="relative mx-auto shadow-xl rounded-lg overflow-hidden bg-black">
            <AspectRatio ratio={16/9} className="bg-black">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {isEmbedded ? (
                <iframe 
                  src={getEmbedUrl(videoUrl)}
                  className="w-full h-full absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  onLoad={handleVideoLoaded}
                  onError={handleVideoError}
                ></iframe>
              ) : (
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
              )}
            </AspectRatio>
          </div>
          
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
        </div>
      </div>
    </section>
  );
};
