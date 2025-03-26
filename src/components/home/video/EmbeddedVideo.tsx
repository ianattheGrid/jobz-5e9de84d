
import { useState, useEffect, useRef } from "react";
import { extractSrcFromEmbedCode, getEmbedUrl } from "@/utils/videoUtils";

interface EmbeddedVideoProps {
  videoUrl: string;
  onError: () => void;
  onLoaded: () => void;
}

export const EmbeddedVideo = ({ videoUrl, onError, onLoaded }: EmbeddedVideoProps) => {
  const [iframeKey, setIframeKey] = useState(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    console.log("Using embed code:", videoUrl);
    setIframeKey(Date.now());
    
    // Handle HeyGen videos that come as full iframe HTML
    if (videoUrl.includes('<iframe') && videoUrl.includes('heygen.com')) {
      if (containerRef.current) {
        try {
          // Clear any previous content first
          containerRef.current.innerHTML = '';
          
          // Set the innerHTML to the raw iframe HTML after a small delay
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.innerHTML = videoUrl;
              console.log("HeyGen iframe set via innerHTML");
              
              // Let the parent know the video has loaded after another small delay
              setTimeout(() => onLoaded(), 800);
            }
          }, 200);
        } catch (error) {
          console.error("Error setting HeyGen iframe:", error);
          onError();
        }
      }
    }
  }, [videoUrl, onLoaded, onError]);

  // For HeyGen videos, we'll render the raw HTML
  if (videoUrl.includes('<iframe') && videoUrl.includes('heygen.com')) {
    return (
      <div 
        ref={containerRef} 
        className="w-full h-full absolute inset-0 bg-transparent"
        style={{ maxHeight: "400px" }}
      />
    );
  }

  // For other embedded videos like YouTube, we'll use an iframe
  // Extract the source URL if it's an embed code
  const srcUrl = videoUrl.includes('<iframe') ? extractSrcFromEmbedCode(videoUrl) : getEmbedUrl(videoUrl);

  return (
    <iframe 
      key={iframeKey}
      src={srcUrl}
      className="w-full h-full absolute inset-0"
      style={{ maxHeight: "400px" }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowFullScreen
      onLoad={() => {
        console.log("Iframe loaded successfully");
        onLoaded();
      }}
      onError={() => {
        console.error("Iframe failed to load");
        onError();
      }}
      referrerPolicy="origin"
    ></iframe>
  );
};
