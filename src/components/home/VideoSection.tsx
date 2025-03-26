
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

export const VideoSection = () => {
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
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            Note: You'll need to upload a HeyGen video to replace this placeholder.
          </p>
        </div>
      </div>
    </section>
  );
};
