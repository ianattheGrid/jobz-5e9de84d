import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { ProofOfPotentialSection } from "@/components/candidate/proof-of-potential/ProofOfPotentialSection";
import { PersonalitySection } from "@/components/candidate/PersonalitySection";
import { Sparkles, Brain, Star } from "lucide-react";

interface SpecialSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function SpecialSection({ userId, profileData, onSave }: SpecialSectionProps) {
  const visibleSections = (profileData as any)?.visible_sections;
  const showProofOfPotential = visibleSections?.proof_of_potential !== false;

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <div>
              <GlowCardTitle>Special Sections</GlowCardTitle>
              <GlowCardDescription>
                Stand out with unique profile sections that showcase your personality and potential.
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
      </GlowCard>

      {/* Proof of Potential */}
      {showProofOfPotential && (
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-primary/10 rounded-full" />
          <GlowCard>
            <GlowCardHeader>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-amber-500" />
                <div>
                  <GlowCardTitle className="text-lg">Proof of Potential</GlowCardTitle>
                  <GlowCardDescription>
                    Perfect for candidates aged 18-25 who want to showcase their potential beyond traditional experience.
                  </GlowCardDescription>
                </div>
              </div>
            </GlowCardHeader>
            <GlowCardContent>
              <ProofOfPotentialSection
                userId={userId}
                initialData={(profileData as any)?.proof_of_potential || null}
              />
            </GlowCardContent>
          </GlowCard>
        </div>
      )}

      {/* Personality Questions */}
      <div className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 to-blue-500/10 rounded-full" />
        <GlowCard>
          <GlowCardHeader>
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-blue-500" />
              <div>
                <GlowCardTitle className="text-lg">Personality Questions</GlowCardTitle>
                <GlowCardDescription>
                  Help employers understand your working style and personality through fun questions.
                </GlowCardDescription>
              </div>
            </div>
          </GlowCardHeader>
          <GlowCardContent>
            <PersonalitySection
              userId={userId}
              initialItems={(profileData as any)?.personality || null}
              onSaved={(items) => {
                // Trigger refresh
                onSave();
              }}
            />
          </GlowCardContent>
        </GlowCard>
      </div>
    </div>
  );
}
