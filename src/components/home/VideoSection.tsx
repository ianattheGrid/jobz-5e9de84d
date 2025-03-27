
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const VideoSection = () => {
  // Replace YOUR_VIDEO_ID with your actual Vimeo video ID
  // Example: if your Vimeo URL is https://vimeo.com/123456789, use 123456789
  const videoId = "YOUR_VIDEO_ID";
  
  // Complete iframe embed code
  const videoEmbed = `<iframe src="https://player.vimeo.com/video/${videoId}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  
  return (
    <section className="py-16 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Video on the left */}
          <div className="w-full md:w-1/2">
            <div className="relative mx-auto overflow-hidden rounded-lg">
              <AspectRatio ratio={16/9}>
                <div 
                  className="w-full h-full absolute inset-0 bg-gray-100 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: videoEmbed }}
                />
              </AspectRatio>
            </div>
          </div>
          
          {/* Content on the right - placeholder for your custom content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">AI Digital Experts</h2>
            <p className="text-lg mb-6">
              Add your custom content here. This area is designed for you to add your own text explaining the video or providing additional information about your services.
            </p>
            <p className="text-lg mb-6">
              You can provide this content later, and it will appear in this section alongside the video.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
