
import { useState, useEffect } from "react";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { isEmbeddedVideoUrl } from "@/utils/videoUtils";
import { DirectVideo } from "./video/DirectVideo";
import { EmbeddedVideo } from "./video/EmbeddedVideo";

export const VideoSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmbedded, setIsEmbedded] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Use a fixed embedded YouTube URL that's known to work
  const videoUrl = "https://www.youtube.com/embed/C0DPdy98e4c";

  useEffect(() => {
    setIsEmbedded(true);
  }, []);

  const handleVideoError = () => {
    console.error("Video error occurred");
    setHasError(true);
    setIsLoading(false);
  };

  const handleVideoLoaded = () => {
    console.log("Video loaded successfully");
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <section className="py-4 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-3xl font-bold mb-4 ${PRIMARY_COLOR_PATTERN}`}>
            See How It Works
          </h2>
          <p className="text-foreground mb-6">
            Watch our short explainer video to understand how jobz can transform your hiring experience.
          </p>
          
          <div className="relative mx-auto overflow-hidden">
            <AspectRatio ratio={16/9} className="bg-transparent">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
                  <div className="text-white text-center p-6 max-w-md">
                    <p className="text-xl font-semibold mb-2">Video could not be loaded</p>
                  </div>
                </div>
              )}
              
              <EmbeddedVideo 
                videoUrl={videoUrl}
                onError={handleVideoError}
                onLoaded={handleVideoLoaded}
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
};
