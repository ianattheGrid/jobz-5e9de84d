
import { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { EmbeddedVideo } from "./video/EmbeddedVideo";

export const VideoSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoUrl = '<iframe src="https://app.heygen.com/embed/c9624eacca7c49ca8b2dc24db2d8c777" width="600" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>';
  
  useEffect(() => {
    // Ensure video is marked as loaded
    setIsLoading(false);
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
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2">
            <div className="relative mx-auto overflow-hidden rounded-lg">
              <AspectRatio ratio={16/9}>
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
          
          <div className="w-full md:w-1/2">
            {/* Content for the right side will be added later */}
          </div>
        </div>
      </div>
    </section>
  );
};
