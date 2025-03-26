
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const VideoSection = () => {
  const [videoUrl, setVideoUrl] = useState('<iframe src="https://app.heygen.com/embed/c9624eacca7c49ca8b2dc24db2d8c777" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>');
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(videoUrl);
  
  const handleSaveUrl = () => {
    setVideoUrl(tempUrl);
    setIsEditing(false);
  };

  return (
    <section className="py-16 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Video on the left */}
          <div className="w-full md:w-1/2">
            <div className="relative mx-auto overflow-hidden rounded-lg shadow-md">
              <AspectRatio ratio={16/9}>
                <div 
                  className="w-full h-full absolute inset-0 bg-gray-100 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: videoUrl }}
                />
              </AspectRatio>
              
              {/* Simple controls for admin */}
              <div className="mt-4">
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      className="w-full"
                      placeholder="Paste iframe embed code here"
                      value={tempUrl}
                      onChange={(e) => setTempUrl(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveUrl}>Save</Button>
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
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Change Video
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Content on the right */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">AI-Powered Recruiting</h2>
            <p className="text-lg mb-6">
              Our platform harnesses the power of artificial intelligence to match the right candidates with your open positions. With advanced algorithms and machine learning, we can identify ideal candidates based on skills, experience, and culture fit.
            </p>
            <p className="text-lg mb-6">
              The AI assistant shown in the video demonstrates how our technology can represent your company, engage with candidates, and streamline the recruiting process.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="text-white bg-primary hover:bg-primary/90">Learn More</Button>
              <Button variant="outline">Schedule Demo</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
