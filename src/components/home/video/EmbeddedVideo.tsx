
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
        containerRef.current.innerHTML = videoUrl;
        onLoaded();
      }
    }
  }, [videoUrl, onLoaded]);

  // For HeyGen videos, we'll render the raw HTML
  if (videoUrl.includes('<iframe') && videoUrl.includes('heygen.com')) {
    return (
      <div 
        ref={containerRef} 
        className="w-full h-full absolute inset-0"
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
