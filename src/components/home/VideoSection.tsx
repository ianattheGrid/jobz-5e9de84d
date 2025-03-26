
import { useState } from "react";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const VideoSection = () => {
  const [videoUrl, setVideoUrl] = useState("https://www.w3schools.com/html/mov_bbb.mp4");
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(videoUrl);

  const handleSaveUrl = () => {
    setVideoUrl(tempUrl);
    setIsEditing(false);
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl font-bold mb-6 ${PRIMARY_COLOR_PATTERN}`}>
            See How It Works
          </h2>
          <p className="text-foreground mb-8">
            Watch our short explainer video to understand how jobz can transform your hiring experience.
          </p>
          
          <div className="relative aspect-video mx-auto shadow-xl rounded-lg overflow-hidden">
            <video 
              className="w-full h-full object-cover" 
              controls
              poster="/placeholder.svg"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="mt-6">
            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                <Input
                  className="max-w-md"
                  placeholder="Enter video URL (MP4 format)"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveUrl}
                    className="bg-primary"
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setTempUrl(videoUrl);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="text-sm"
              >
                Change Video URL
              </Button>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              Note: Enter a direct link to an MP4 video file, such as one from HeyGen or another video hosting service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
