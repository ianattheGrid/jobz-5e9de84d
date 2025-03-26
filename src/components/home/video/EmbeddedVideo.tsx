
import { useState, useEffect } from "react";
import { extractSrcFromEmbedCode, getEmbedUrl } from "@/utils/videoUtils";

interface EmbeddedVideoProps {
  videoUrl: string;
  onError: () => void;
  onLoaded: () => void;
}

export const EmbeddedVideo = ({ videoUrl, onError, onLoaded }: EmbeddedVideoProps) => {
  const [iframeKey, setIframeKey] = useState(Date.now());
  
  useEffect(() => {
    console.log("Using embed URL:", videoUrl);
    setIframeKey(Date.now());
  }, [videoUrl]);

  return (
    <iframe 
      key={iframeKey}
      src={videoUrl}
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
