import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Save, Rocket, TrendingUp, Zap, RefreshCw, Award, Check, ArrowLeft, Pencil } from "lucide-react";
import { CAREER_STAGES, CareerStage } from "../types";
import { cn } from "@/lib/utils";
import { GettingStartedSection } from "@/components/candidate/getting-started/GettingStartedSection";
import { AscentSection } from "@/components/candidate/ascent/AscentSection";
import { CoreSection } from "@/components/candidate/core/CoreSection";
import { PivotSection } from "@/components/candidate/pivot/PivotSection";

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
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    if (profileData) {
      const profileAny = profileData as any;
      const savedStage = profileAny.primary_career_stage || null;
      setPrimaryStage(savedStage);
      setSecondaryStages(profileAny.secondary_career_stages || []);
      // If they already have a saved stage, show questions by default
      if (savedStage) {
        setShowQuestions(true);
      }
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
      // Show the questions after saving
      setShowQuestions(true);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeStage = () => {
    setShowQuestions(false);
  };

  const selectedStageInfo = CAREER_STAGES.find(s => s.id === primaryStage);
  const profileAny = profileData as any;

  // Render the dynamic questions based on selected stage
  const renderStageQuestions = () => {
    if (!primaryStage) return null;

    switch (primaryStage) {
      case 'launchpad':
        return (
          <GettingStartedSection 
            userId={userId} 
            initialData={profileAny?.proof_of_potential || null}
          />
        );
      case 'ascent':
        return (
          <AscentSection 
            userId={userId} 
            initialData={profileAny?.ascent_profile || null}
          />
        );
      case 'core':
        return (
          <CoreSection 
            userId={userId} 
            initialData={profileAny?.core_profile || null}
          />
        );
      case 'pivot':
        return (
          <PivotSection 
            userId={userId} 
            initialData={profileAny?.pivot_profile || null}
          />
        );
      case 'encore':
        return (
          <GlowCard>
            <GlowCardContent className="py-8">
              <div className="flex flex-col items-center justify-center text-center">
                <Award className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">The Encore Questions</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Questions for semi-retired or returning professionals will be available soon.
                  Share what meaningful work looks like to you now.
                </p>
              </div>
            </GlowCardContent>
          </GlowCard>
        );
      default:
        return null;
    }
  };

  // If showing questions (after stage is saved)
  if (showQuestions && primaryStage) {
    const StageIcon = iconMap[selectedStageInfo?.icon || 'Rocket'] || Rocket;
    
    return (
      <div className="space-y-6">
        {/* Current Stage Header */}
        <GlowCard>
          <GlowCardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <StageIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Career Stage</p>
                  <h3 className="font-semibold text-foreground">{selectedStageInfo?.label}</h3>
                  <p className="text-xs text-muted-foreground">{selectedStageInfo?.experienceRange}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleChangeStage} className="gap-2">
                <Pencil className="h-4 w-4" />
                Change Stage
              </Button>
            </div>
          </GlowCardContent>
        </GlowCard>

        {/* Stage-specific Questions */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Tell us about your journey
          </h3>
          {renderStageQuestions()}
        </div>
      </div>
    );
  }

  // Stage Selection View
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
              Save & Continue
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
