import { useState, useEffect } from "react";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";
import { toast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { isEmbeddedVideoUrl, hasCompleteHeyGenEmbed } from "@/utils/videoUtils";
import { DirectVideo } from "./video/DirectVideo";
import { EmbeddedVideo } from "./video/EmbeddedVideo";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const VideoSection = () => {
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=C0DPdy98e4c");
  const [isLoading, setIsLoading] = useState(true);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isHeyGenHelp, setIsHeyGenHelp] = useState(false);

  useEffect(() => {
    processVideoUrl(videoUrl);
  }, [videoUrl, attemptCount]);

  const processVideoUrl = (url: string) => {
    setIsLoading(true);
    setHasError(false);
    
    console.log("Processing video URL:", url);
    
    if (url.includes('heygen.com')) {
      console.log("HeyGen video detected");
      setIsEmbedded(true);
      
      if (hasCompleteHeyGenEmbed(url)) {
        console.log("Complete HeyGen iframe detected, hiding help dialog");
        setIsHeyGenHelp(false);
      } else {
        console.log("Incomplete HeyGen URL detected, showing help dialog");
        setIsHeyGenHelp(true);
      }
    } else {
      setIsHeyGenHelp(false);
      
      const shouldEmbed = isEmbeddedVideoUrl(url);
      console.log("Should this be embedded?", shouldEmbed);
      setIsEmbedded(shouldEmbed);
    }
    
    if (isEmbedded) {
      const timeout = setTimeout(() => {
        if (isLoading) {
          console.log("Embedded video timeout reached, considering loaded");
          setIsLoading(false);
        }
      }, 7000);
      
      return () => clearTimeout(timeout);
    }
  };

  const handleVideoError = () => {
    console.error("Video error occurred with URL:", videoUrl);
    setHasError(true);
    setIsLoading(false);
    
    if (videoUrl.includes('heygen.com')) {
      toast({
        title: "HeyGen Video Error",
        description: "Unable to load HeyGen video. Please use the complete iframe embed code from the 'Share' button, not just the URL.",
        variant: "destructive",
      });
      if (!isHeyGenHelp) {
        setIsHeyGenHelp(true);
      }
    } else {
      toast({
        title: "Video Error",
        description: isEmbedded 
          ? "Unable to load the embedded video. For videos from services like YouTube or Vimeo, please use their embed code."
          : "Unable to load video from the provided URL. Please check the URL and try again.",
        variant: "destructive",
      });
    }
  };

  const handleVideoLoaded = () => {
    console.log("Video loaded successfully");
    setIsLoading(false);
    setHasError(false);
    
    if (videoUrl.includes('heygen.com')) {
      setIsHeyGenHelp(false);
    }
  };

  const handleVideoUrlChange = (newUrl: string) => {
    if (newUrl === videoUrl) {
      setAttemptCount(prev => prev + 1);
      return;
    }
    
    console.log("Changing video URL to:", newUrl);
    setIsLoading(true);
    setHasError(false);
    setVideoUrl(newUrl);
    
    if (newUrl.includes('heygen.com')) {
      if (hasCompleteHeyGenEmbed(newUrl)) {
        console.log("Complete HeyGen iframe detected on URL change, hiding help dialog");
        setIsHeyGenHelp(false);
      } else {
        console.log("Incomplete HeyGen URL detected on URL change, showing help dialog");
        setIsHeyGenHelp(true);
      }
    } else {
      setIsHeyGenHelp(false);
    }
  };

  const closeHeyGenHelp = () => {
    setIsHeyGenHelp(false);
  };

  return (
    <section className="py-8 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
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
                    <p className="text-sm mb-4">Please try a different URL or embed code</p>
                  </div>
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
          
          <Dialog open={isHeyGenHelp} onOpenChange={setIsHeyGenHelp}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>How to Embed HeyGen Videos</DialogTitle>
                <DialogDescription>
                  Follow these steps to correctly embed a HeyGen video:
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Go to your HeyGen video</li>
                  <li>Click the <strong>Share</strong> button</li>
                  <li>Select the <strong>Embed</strong> tab</li>
                  <li>Click <strong>Copy Code</strong> to copy the entire iframe embed code</li>
                  <li>Paste the complete code (not just the URL) into the "Embed Code" field</li>
                </ol>
                <div className="bg-muted p-3 rounded text-xs overflow-auto">
                  <pre className="whitespace-pre-wrap">
                    {'<iframe src="https://app.heygen.com/embed/..." width="600" height="340" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'}
                  </pre>
                </div>
                <p className="text-xs text-muted-foreground">
                  Note: HeyGen requires the complete iframe code to properly handle cross-origin embedding.
                  Alternatively, you can upload your video to Vimeo for easier embedding.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};
