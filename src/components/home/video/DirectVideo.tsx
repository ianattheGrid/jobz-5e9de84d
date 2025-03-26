
import { useEffect, useRef, useState } from "react";
import { detectVideoFormat } from "@/utils/videoUtils";
import { toast } from "@/hooks/use-toast";

interface DirectVideoProps {
  videoUrl: string;
  onError: () => void;
  onLoaded: () => void;
}

export const DirectVideo = ({ videoUrl, onError, onLoaded }: DirectVideoProps) => {
  const [videoFormat, setVideoFormat] = useState("video/mp4");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoKey, setVideoKey] = useState(Date.now());

  useEffect(() => {
    console.log("Loading direct video from URL:", videoUrl);
    const format = detectVideoFormat(videoUrl);
    console.log("Detected format:", format);
    setVideoFormat(format);
    
    // Generate a new key to force video element refresh
    setVideoKey(Date.now());
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.load();
      
      // Try to play the video after it's loaded
      const playVideo = () => {
        console.log("Video data loaded, attempting to play");
        videoRef.current?.play().catch(error => {
          console.error("Video playback failed:", error);
          // Don't show toast for autoplay failures - this is expected on many browsers
          // Just let the user click play manually
        });
      };

      videoRef.current.addEventListener("loadeddata", playVideo, { once: true });
      return () => {
        videoRef.current?.removeEventListener("loadeddata", playVideo);
      };
    }
  }, [videoUrl]);

  return (
    <video 
      key={videoKey}
      ref={videoRef}
      className="w-full h-full object-contain" 
      controls
      poster="/placeholder.svg"
      onError={(e) => {
        console.error("Video error:", e);
        onError();
      }}
      onLoadedData={() => {
        console.log("Video loaded successfully");
        onLoaded();
      }}
      playsInline
      crossOrigin="anonymous" // Try to handle CORS issues gracefully
    >
      <source src={videoUrl} type={videoFormat} />
      Your browser does not support the video tag.
    </video>
  );
};
