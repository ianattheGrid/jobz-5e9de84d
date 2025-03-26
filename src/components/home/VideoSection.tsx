import { useState, useEffect } from "react";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";
import { toast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { isEmbeddedVideoUrl } from "@/utils/videoUtils";
import { DirectVideo } from "./video/DirectVideo";
import { EmbeddedVideo } from "./video/EmbeddedVideo";
import { VideoControls } from "./video/VideoControls";

export const VideoSection = () => {
  const [videoUrl, setVideoUrl] = useState("https://www.w3schools.com/html/mov_bbb.mp4");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);

  // This effect will process the video URL when it changes
  useEffect(() => {
    processVideoUrl(videoUrl);
  }, [videoUrl]);

  const processVideoUrl = (url: string) => {
    setIsLoading(true);
    
    // Check if this is a direct video file or needs to be embedded
    const shouldEmbed = isEmbeddedVideoUrl(url);
    setIsEmbedded(shouldEmbed);
    
    // For embedded videos, we can sometimes remove the loading state sooner
    if (shouldEmbed) {
      // For some embedded videos, the loading state might be handled by the iframe itself
      // We'll still keep a fallback timeout to ensure we don't get stuck loading
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
        }
      }, 5000);
    }
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

  const handleVideoUrlChange = (newUrl: string) => {
    setIsLoading(true);
    setVideoUrl(newUrl);
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
                <EmbeddedVideo 
                  videoUrl={videoUrl}
                  onError={handleVideoError}
                  onLoaded={handleVideoLoaded}
                />
              ) : (
                <DirectVideo 
                  videoUrl={videoUrl}
                  onError={handleVideoError}
                  onLoaded={handleVideoLoaded}
                />
              )}
            </AspectRatio>
          </div>
          
          <VideoControls 
            videoUrl={videoUrl}
            onVideoUrlChange={handleVideoUrlChange}
          />
        </div>
      </div>
    </section>
  );
};
