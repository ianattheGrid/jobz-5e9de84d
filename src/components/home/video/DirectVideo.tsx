
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

  useEffect(() => {
    const format = detectVideoFormat(videoUrl);
    setVideoFormat(format);
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.load();
      
      // Try to play the video after it's loaded
      const playVideo = () => {
        videoRef.current?.play().catch(error => {
          console.error("Video playback failed:", error);
          toast({
            title: "Playback Issue",
            description: "Video loaded but couldn't autoplay. You can click play manually.",
            variant: "default",
          });
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
      ref={videoRef}
      className="w-full h-full object-contain" 
      controls
      poster="/placeholder.svg"
      onError={onError}
      onLoadedData={onLoaded}
      playsInline
    >
      <source src={videoUrl} type={videoFormat} />
      Your browser does not support the video tag.
    </video>
  );
};
