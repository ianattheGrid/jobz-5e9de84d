
import { useState } from "react";
import { getEmbedUrl } from "@/utils/videoUtils";

interface EmbeddedVideoProps {
  videoUrl: string;
  onError: () => void;
  onLoaded: () => void;
}

export const EmbeddedVideo = ({ videoUrl, onError, onLoaded }: EmbeddedVideoProps) => {
  const [embedUrl] = useState(() => getEmbedUrl(videoUrl));

  return (
    <iframe 
      src={embedUrl}
      className="w-full h-full absolute inset-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowFullScreen
      onLoad={onLoaded}
      onError={onError}
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
    ></iframe>
  );
};
