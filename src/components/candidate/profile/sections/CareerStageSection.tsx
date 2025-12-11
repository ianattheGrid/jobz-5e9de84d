import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Save, Rocket, TrendingUp, Zap, RefreshCw, Award, Check } from "lucide-react";
import { CAREER_STAGES, CareerStage } from "../types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  TrendingUp,
  Zap,
  RefreshCw,
  Award,
};

interface CareerStageSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function CareerStageSection({ userId, profileData, onSave }: CareerStageSectionProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [primaryStage, setPrimaryStage] = useState<CareerStage | null>(null);
  const [secondaryStages, setSecondaryStages] = useState<CareerStage[]>([]);

  useEffect(() => {
    if (profileData) {
      const profileAny = profileData as any;
      setPrimaryStage(profileAny.primary_career_stage || null);
      setSecondaryStages(profileAny.secondary_career_stages || []);
    }
  }, [profileData]);

  const handlePrimarySelect = (stage: CareerStage) => {
    setPrimaryStage(stage);
    // Remove from secondary if it was there
    setSecondaryStages(prev => prev.filter(s => s !== stage));
  };

  const handleSecondaryToggle = (stage: CareerStage) => {
    if (stage === primaryStage) return; // Can't select primary as secondary
    
    setSecondaryStages(prev => 
      prev.includes(stage) 
        ? prev.filter(s => s !== stage)
        : [...prev, stage]
    );
  };

  const handleSubmit = async () => {
    if (!primaryStage) {
      toast({
        variant: "destructive",
        title: "Please select a primary career stage",
        description: "Choose the stage that best describes where you are in your career journey.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('candidate_profiles')
        .update({
          primary_career_stage: primaryStage,
          secondary_career_stages: secondaryStages,
        })
        .eq('id', userId);

      if (error) throw error;

      toast({ title: "Success", description: "Career stage saved successfully" });
      onSave();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>Where are you in your career journey?</GlowCardTitle>
          <GlowCardDescription>
            Select your primary career stage. This helps us tailor questions and match you with the right opportunities.
          </GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CAREER_STAGES.map((stage) => {
              const Icon = iconMap[stage.icon] || Rocket;
              const isSelected = primaryStage === stage.id;
              
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => handlePrimarySelect(stage.id)}
                  className={cn(
                    "relative flex flex-col items-start gap-3 p-4 rounded-lg border-2 text-left transition-all",
                    isSelected 
                      ? "border-primary bg-primary/5 shadow-md" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div className={cn(
                    "p-2 rounded-full",
                    isSelected ? "bg-primary/10" : "bg-muted"
                  )}>
                    <Icon className={cn(
                      "h-6 w-6",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{stage.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{stage.experienceRange}</p>
                    <p className="text-sm text-muted-foreground mt-2">{stage.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </GlowCardContent>
      </GlowCard>

      {/* Secondary Stages */}
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>Additional Career Stages (Optional)</GlowCardTitle>
          <GlowCardDescription>
            Do any other stages also apply to you? Select all that fit.
          </GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent>
          <div className="space-y-3">
            {CAREER_STAGES.filter(s => s.id !== primaryStage).map((stage) => {
              const Icon = iconMap[stage.icon] || Rocket;
              const isSelected = secondaryStages.includes(stage.id);
              
              return (
                <label
                  key={stage.id}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all",
                    isSelected 
                      ? "border-primary/50 bg-primary/5" 
                      : "border-border hover:bg-muted/50"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleSecondaryToggle(stage.id)}
                  />
                  <Icon className={cn(
                    "h-5 w-5",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                  <div className="flex-1">
                    <span className="font-medium">{stage.label}</span>
                    <span className="text-sm text-muted-foreground ml-2">({stage.experienceRange})</span>
                  </div>
                </label>
              );
            })}
          </div>
        </GlowCardContent>
      </GlowCard>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting || !primaryStage}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Career Stage
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
