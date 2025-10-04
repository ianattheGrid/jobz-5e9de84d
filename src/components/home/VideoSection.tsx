
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const VideoSection = () => {
  // Using the Vimeo video ID from the user's embed code
  const videoId = "1069924968"; // Extracted from the user's Vimeo embed code
  
  // Complete iframe embed code
  const videoEmbed = `<iframe src="https://player.vimeo.com/video/${videoId}?h=57c269d6d1&badge=0&autopause=0&player_id=0&app_id=58479" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" allowfullscreen title="Jobz"></iframe>`;
  
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
          
          {/* Updated content on the right */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">No more middlemen</h2>
            <p className="text-lg mb-6">
              Thanks to AI, the hiring world is about to change dramatically. The traditional recruitment 
              process with expensive third-party agencies is becoming obsolete.
            </p>
            <p className="text-lg mb-6">
              Watch theGrid's video to see the contrast between the old recruiting world and 
              the new AI-powered direct hiring approach that connects employers and candidates 
              without intermediaries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
