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
  const [rawHtml, setRawHtml] = useState<string | null>(null);
  
  useEffect(() => {
    console.log("Processing video URL for embedding:", videoUrl);
    
    // HeyGen special handling - use the raw embed code
    if (videoUrl.includes('<iframe') && videoUrl.includes('heygen.com')) {
      console.log("Using raw HeyGen iframe embed code");
      setRawHtml(videoUrl);
      setEmbedUrl("");
    } else if (videoUrl.includes('<iframe') && videoUrl.includes('iframe>')) {
      console.log("Detected iframe embed code");
      const src = extractSrcFromEmbedCode(videoUrl);
      console.log("Extracted src:", src);
      setEmbedUrl(src);
      setRawHtml(null);
    } else {
      // Otherwise, convert the URL to an embed URL
      console.log("Converting URL to embed URL");
      const embedUrl = getEmbedUrl(videoUrl);
      console.log("Converted to embed URL:", embedUrl);
      setEmbedUrl(embedUrl);
      setRawHtml(null);
    }
    
    // Generate a new key to force iframe refresh
    setIframeKey(Date.now());
  }, [videoUrl]);

  // Special case: render the raw HTML for HeyGen
  if (rawHtml) {
    return (
      <div 
        className="w-full h-full absolute inset-0"
        dangerouslySetInnerHTML={{ __html: rawHtml }}
        onLoad={() => {
          console.log("Raw HTML iframe loaded successfully");
          onLoaded();
        }}
      />
    );
  }

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
      referrerPolicy="origin"
    ></iframe>
  );
};
