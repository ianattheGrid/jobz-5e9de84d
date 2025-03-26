
import { useState, useEffect } from "react";
import { extractSrcFromEmbedCode, getEmbedUrl, cleanUpEmbedCode, isHeyGenVideo, hasCompleteHeyGenEmbed } from "@/utils/videoUtils";

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
    
    // First, clean up the embed code if it's an iframe
    const cleanedEmbedCode = cleanUpEmbedCode(videoUrl);
    
    // HeyGen special handling - use the raw embed code
    if (isHeyGenVideo(cleanedEmbedCode)) {
      if (hasCompleteHeyGenEmbed(cleanedEmbedCode)) {
        console.log("Using complete HeyGen iframe embed code");
        setRawHtml(cleanedEmbedCode);
        setEmbedUrl("");
        
        // Since we know this is a complete HeyGen embed, we can trigger onLoaded
        // This will help ensure the help dialog closes properly
        setTimeout(() => {
          onLoaded();
        }, 500);
      } else if (cleanedEmbedCode.includes('<iframe')) {
        console.log("Using partial HeyGen iframe embed code");
        setRawHtml(cleanedEmbedCode);
        setEmbedUrl("");
      } else {
        // Try to create a standard iframe for HeyGen URL
        console.log("Creating standard iframe for HeyGen URL");
        const heyGenEmbed = `<iframe src="${cleanedEmbedCode}" width="600" height="340" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
        setRawHtml(heyGenEmbed);
        setEmbedUrl("");
      }
    } else if (cleanedEmbedCode.includes('<iframe') && cleanedEmbedCode.includes('iframe>')) {
      console.log("Detected iframe embed code");
      const src = extractSrcFromEmbedCode(cleanedEmbedCode);
      console.log("Extracted src:", src);
      
      if (src) {
        setEmbedUrl(src);
        setRawHtml(null);
      } else {
        // If we couldn't extract src, use raw HTML as fallback
        setRawHtml(cleanedEmbedCode);
        setEmbedUrl("");
      }
    } else {
      // Otherwise, convert the URL to an embed URL
      console.log("Converting URL to embed URL");
      const embedUrl = getEmbedUrl(cleanedEmbedCode);
      console.log("Converted to embed URL:", embedUrl);
      setEmbedUrl(embedUrl);
      setRawHtml(null);
    }
    
    // Generate a new key to force iframe refresh
    setIframeKey(Date.now());
  }, [videoUrl, onLoaded]);

  // Special case: render the raw HTML for HeyGen or other raw HTML embeds
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
