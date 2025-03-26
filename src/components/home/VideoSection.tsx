
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
  
  // Use HeyGen embed code
  const videoUrl = '<iframe src="https://app.heygen.com/embed/c9624eacca7c49ca8b2dc24db2d8c777" width="600" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>';

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
    <section className="py-2 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative mx-auto overflow-hidden rounded-lg shadow-md">
            <AspectRatio ratio={16/9} className="bg-gray-100">
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
