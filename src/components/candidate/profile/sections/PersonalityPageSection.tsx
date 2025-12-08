import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { PersonalitySection } from "@/components/candidate/PersonalitySection";
import { Brain } from "lucide-react";

interface PersonalityPageSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function PersonalityPageSection({ userId, profileData, onSave }: PersonalityPageSectionProps) {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-blue-500" />
            <div>
              <GlowCardTitle>Personality</GlowCardTitle>
              <GlowCardDescription>
                Help employers understand your working style and personality through fun questions.
                This helps find the perfect cultural fit!
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
      </GlowCard>

      {/* Main Content */}
      <GlowCard>
        <GlowCardContent className="pt-6">
          <PersonalitySection
            userId={userId}
            initialItems={(profileData as any)?.personality || null}
            onSaved={onSave}
          />
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
