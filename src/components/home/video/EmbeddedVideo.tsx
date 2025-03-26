import { useState, useEffect } from "react";
import { extractSrcFromEmbedCode, getEmbedUrl } from "@/utils/videoUtils";

interface EmbeddedVideoProps {
  videoUrl: string;
  onError: () => void;
  onLoaded: () => void;
}

export const EmbeddedVideo = ({ videoUrl, onError, onLoaded }: EmbeddedVideoProps) => {
  const [embedUrl, setEmbedUrl] = useState("");
  const [iframeKey, setIframeKey] = useState(Date.now());
  
  useEffect(() => {
    console.log("Processing video URL for embedding:", videoUrl);
    
    // Check if it's an embed code (contains iframe)
    if (videoUrl.includes('<iframe') && videoUrl.includes('iframe>')) {
      console.log("Detected iframe embed code");
      const src = extractSrcFromEmbedCode(videoUrl);
      console.log("Extracted src:", src);
      setEmbedUrl(src);
    } else {
      // Otherwise, convert the URL to an embed URL
      console.log("Converting URL to embed URL");
      const embedUrl = getEmbedUrl(videoUrl);
      console.log("Converted to embed URL:", embedUrl);
      setEmbedUrl(embedUrl);
    }
    
    // Generate a new key to force iframe refresh
    setIframeKey(Date.now());
  }, [videoUrl]);

  if (!embedUrl) {
    console.log("No embed URL available, returning null");
    return null;
  }

  return (
    <iframe 
      key={iframeKey}
      src={embedUrl}
      className="w-full h-full absolute inset-0"
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
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
      referrerPolicy="origin"
    ></iframe>
  );
};
