import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface HowItWorksHeroProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const HowItWorksHero = ({ activeTab, onTabChange }: HowItWorksHeroProps) => {
  return (
    <>
      {/* Gradient Banner Section */}
      <section className="relative h-[300px] overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#1a1047] to-[#0d1b2a]">
        {/* Large Bright Stars with Glow */}
        <div className="absolute w-2 h-2 bg-white rounded-full top-[25%] left-[15%] animate-twinkle animate-pulse-glow" style={{ animationDelay: '0s' }} />
        <div className="absolute w-3 h-3 bg-white rounded-full top-[15%] left-[85%] animate-twinkle animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
        <div className="absolute w-2.5 h-2.5 bg-white rounded-full top-[35%] left-[45%] animate-twinkle animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute w-2 h-2 bg-white rounded-full top-[80%] left-[70%] animate-twinkle animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute w-2.5 h-2.5 bg-white rounded-full top-[70%] left-[25%] animate-twinkle animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute w-2 h-2 bg-white rounded-full top-[60%] left-[90%] animate-twinkle animate-pulse-glow" style={{ animationDelay: '2.5s' }} />
        
        {/* Medium Stars */}
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[45%] left-[10%] animate-twinkle-slow opacity-70" style={{ animationDelay: '0.3s' }} />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[15%] left-[30%] animate-twinkle-slow opacity-65" style={{ animationDelay: '0.8s' }} />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[65%] left-[55%] animate-twinkle-slow opacity-75" style={{ animationDelay: '1.3s' }} />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[40%] left-[75%] animate-twinkle-slow opacity-70" style={{ animationDelay: '1.8s' }} />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[85%] left-[40%] animate-twinkle-slow opacity-65" style={{ animationDelay: '2.3s' }} />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[20%] left-[65%] animate-twinkle-slow opacity-70" style={{ animationDelay: '2.8s' }} />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[90%] left-[20%] animate-twinkle-slow opacity-65" style={{ animationDelay: '0.2s' }} />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[85%] left-[95%] animate-twinkle-slow opacity-70" style={{ animationDelay: '0.7s' }} />
        
        {/* Small Distant Stars with Float */}
        <div className="absolute w-1 h-1 bg-white rounded-full top-[12%] left-[8%] animate-twinkle animate-float opacity-50" style={{ animationDelay: '0.1s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full top-[35%] left-[22%] animate-twinkle animate-float opacity-45" style={{ animationDelay: '0.6s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full top-[55%] left-[35%] animate-twinkle animate-float opacity-50" style={{ animationDelay: '1.1s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full top-[22%] left-[48%] animate-twinkle animate-float opacity-45" style={{ animationDelay: '1.6s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full top-[75%] left-[58%] animate-twinkle animate-float opacity-50" style={{ animationDelay: '2.1s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full top-[45%] left-[68%] animate-twinkle animate-float opacity-40" style={{ animationDelay: '2.6s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full top-[68%] left-[78%] animate-twinkle animate-float opacity-45" style={{ animationDelay: '0.4s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full top-[28%] left-[88%] animate-twinkle animate-float opacity-50" style={{ animationDelay: '0.9s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full top-[82%] left-[12%] animate-twinkle animate-float opacity-45" style={{ animationDelay: '1.4s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full top-[92%] left-[52%] animate-twinkle animate-float opacity-40" style={{ animationDelay: '1.9s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full top-[8%] left-[82%] animate-twinkle animate-float opacity-50" style={{ animationDelay: '2.4s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full top-[48%] left-[38%] animate-twinkle animate-float opacity-45" style={{ animationDelay: '2.9s' }} />
        
        {/* Shooting Stars */}
        <div className="absolute w-1 h-1 bg-white rounded-full top-[20%] left-[80%] animate-shooting-star" style={{ animationDelay: '0s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full top-[60%] left-[90%] animate-shooting-star" style={{ animationDelay: '5s' }} />
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[40%] left-[70%] animate-shooting-star" style={{ animationDelay: '8s' }} />
        
        {/* Nebula Glow Effects */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle 600px at 20% 30%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
                              radial-gradient(circle 500px at 80% 70%, rgba(139, 92, 246, 0.25) 0%, transparent 50%),
                              radial-gradient(circle 400px at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`
          }}
        />
        
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center">
            How Jobz Works
          </h2>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="bg-background py-12">
        <div className="container mx-auto px-4">
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
