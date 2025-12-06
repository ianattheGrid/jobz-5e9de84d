import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import astronautHelmet from "@/assets/astronaut-helmet.jpg";

interface HowItWorksHeroProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const HowItWorksHero = ({ activeTab, onTabChange }: HowItWorksHeroProps) => {
  return (
    <>
      {/* Hero Banner Section */}
      <section className="relative h-[350px] overflow-hidden">
        {/* Background Image */}
        <img 
          src={astronautHelmet}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[center_20%] md:object-[center_30%] lg:object-[center_40%]"
        />
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        
        {/* Color tint matching the image tones */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20" />
        
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
            How Jobz Works
          </h2>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="bg-background py-12">
        <div className="container mx-auto px-4">
          {/* Section Introduction */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xl text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Jobz cuts through the noise</span> to connect people directly. 
              Select below to see how we make hiring and job hunting faster, fairer, and more human for you.
            </p>
          </div>
          
          <TooltipProvider>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl mx-auto">
              <Button
                variant={activeTab === "hiring" ? "default" : "outline"}
                className="flex-1 h-14 text-base sm:text-lg"
                onClick={() => onTabChange("hiring")}
              >
                <span className="inline-flex items-center">
                  Employers
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="ml-2 h-4 w-4" aria-label="How it works for employers" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Vetted Connectors discreetly source candidates for hard-to-fill roles. You stay in control and only pay on hire.</p>
                    </TooltipContent>
                  </Tooltip>
                </span>
              </Button>
              
              <Button
                variant={activeTab === "candidates" ? "default" : "outline"}
                className="flex-1 h-14 text-base sm:text-lg"
                onClick={() => onTabChange("candidates")}
              >
                <span className="inline-flex items-center">
                  Candidates
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="ml-2 h-4 w-4" aria-label="How it works for candidates" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Get warm intros to relevant roles via Connectors. Your details stay private until you opt in; earn a bonus when hired.</p>
                    </TooltipContent>
                  </Tooltip>
                </span>
              </Button>
              
              <Button
                variant={activeTab === "recruiters" ? "default" : "outline"}
                className="flex-1 h-14 text-base sm:text-lg"
                onClick={() => onTabChange("recruiters")}
              >
                <span className="inline-flex items-center">
                  Connectors
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="ml-2 h-4 w-4" aria-label="More about Connectors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Flexible income by introducing great candidates anonymously from your network. We handle the admin; paid on success.</p>
                    </TooltipContent>
                  </Tooltip>
                </span>
              </Button>
            </div>
          </TooltipProvider>
        </div>
      </section>
    </>
  );
};
