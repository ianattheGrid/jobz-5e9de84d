import { useState, useEffect } from "react";
import { extractSrcFromEmbedCode, getEmbedUrl } from "@/utils/videoUtils";

interface EmbeddedVideoProps {
  videoUrl: string;
  onError: () => void;
  onLoaded: () => void;
}

export const EmbeddedVideo = ({ videoUrl, onError, onLoaded }: EmbeddedVideoProps) => {
  const [embedUrl, setEmbedUrl] = useState("");
  
  useEffect(() => {
    // Check if it's an embed code (contains iframe)
    if (videoUrl.includes('<iframe') && videoUrl.includes('iframe>')) {
      const src = extractSrcFromEmbedCode(videoUrl);
      setEmbedUrl(src);
    } else {
      // Otherwise, convert the URL to an embed URL
      setEmbedUrl(getEmbedUrl(videoUrl));
    }
  }, [videoUrl]);

  if (!embedUrl) {
    return null;
  }

  return (
    <iframe 
      src={embedUrl}
      className="w-full h-full absolute inset-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowFullScreen
      onLoad={onLoaded}
      onError={onError}
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
      referrerPolicy="origin"
    ></iframe>
  );
};
