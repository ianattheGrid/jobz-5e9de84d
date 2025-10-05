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
        {/* Large Bright Stars */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.9) 0, rgba(255, 255, 255, 0.9) 2px, transparent 2px),
                              radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 1) 0, rgba(255, 255, 255, 1) 3px, transparent 3px),
                              radial-gradient(circle at 45% 35%, rgba(255, 255, 255, 0.85) 0, rgba(255, 255, 255, 0.85) 2.5px, transparent 2.5px),
                              radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.95) 0, rgba(255, 255, 255, 0.95) 2px, transparent 2px),
                              radial-gradient(circle at 25% 70%, rgba(255, 255, 255, 0.9) 0, rgba(255, 255, 255, 0.9) 2.5px, transparent 2.5px),
                              radial-gradient(circle at 90% 60%, rgba(255, 255, 255, 0.85) 0, rgba(255, 255, 255, 0.85) 2px, transparent 2px)`,
            backgroundSize: '100% 100%',
            filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))'
          }}
        />
        
        {/* Medium Stars */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 10% 45%, rgba(255, 255, 255, 0.7) 0, rgba(255, 255, 255, 0.7) 1.5px, transparent 1.5px),
                              radial-gradient(circle at 30% 15%, rgba(255, 255, 255, 0.65) 0, rgba(255, 255, 255, 0.65) 1.5px, transparent 1.5px),
                              radial-gradient(circle at 55% 65%, rgba(255, 255, 255, 0.75) 0, rgba(255, 255, 255, 0.75) 1.5px, transparent 1.5px),
                              radial-gradient(circle at 75% 40%, rgba(255, 255, 255, 0.7) 0, rgba(255, 255, 255, 0.7) 1.5px, transparent 1.5px),
                              radial-gradient(circle at 40% 85%, rgba(255, 255, 255, 0.65) 0, rgba(255, 255, 255, 0.65) 1.5px, transparent 1.5px),
                              radial-gradient(circle at 65% 20%, rgba(255, 255, 255, 0.7) 0, rgba(255, 255, 255, 0.7) 1.5px, transparent 1.5px),
                              radial-gradient(circle at 20% 90%, rgba(255, 255, 255, 0.65) 0, rgba(255, 255, 255, 0.65) 1.5px, transparent 1.5px),
                              radial-gradient(circle at 95% 85%, rgba(255, 255, 255, 0.7) 0, rgba(255, 255, 255, 0.7) 1.5px, transparent 1.5px)`,
            backgroundSize: '100% 100%'
          }}
        />
        
        {/* Small Distant Stars */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 8% 12%, rgba(255, 255, 255, 0.5) 0, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                              radial-gradient(circle at 22% 35%, rgba(255, 255, 255, 0.45) 0, rgba(255, 255, 255, 0.45) 1px, transparent 1px),
                              radial-gradient(circle at 35% 55%, rgba(255, 255, 255, 0.5) 0, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                              radial-gradient(circle at 48% 22%, rgba(255, 255, 255, 0.45) 0, rgba(255, 255, 255, 0.45) 1px, transparent 1px),
                              radial-gradient(circle at 58% 75%, rgba(255, 255, 255, 0.5) 0, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                              radial-gradient(circle at 68% 45%, rgba(255, 255, 255, 0.4) 0, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
                              radial-gradient(circle at 78% 68%, rgba(255, 255, 255, 0.45) 0, rgba(255, 255, 255, 0.45) 1px, transparent 1px),
                              radial-gradient(circle at 88% 28%, rgba(255, 255, 255, 0.5) 0, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                              radial-gradient(circle at 12% 82%, rgba(255, 255, 255, 0.45) 0, rgba(255, 255, 255, 0.45) 1px, transparent 1px),
                              radial-gradient(circle at 52% 92%, rgba(255, 255, 255, 0.4) 0, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
                              radial-gradient(circle at 82% 8%, rgba(255, 255, 255, 0.5) 0, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                              radial-gradient(circle at 38% 48%, rgba(255, 255, 255, 0.45) 0, rgba(255, 255, 255, 0.45) 1px, transparent 1px)`,
            backgroundSize: '100% 100%'
          }}
        />
        
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
