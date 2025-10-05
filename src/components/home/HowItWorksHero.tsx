import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface HowItWorksHeroProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const HowItWorksHero = ({ activeTab, onTabChange }: HowItWorksHeroProps) => {
  return (
    <section className="relative h-[450px] overflow-hidden">
      <img 
        src="/lovable-uploads/7be09af5-7186-41b7-867e-8354c980e8a5.png" 
        alt="Astronaut exploring space representing how Jobz platform works" 
        className="absolute inset-0 w-full h-full object-cover" 
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          How Jobz Works
        </h2>
        
        <TooltipProvider>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
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
  );
};
