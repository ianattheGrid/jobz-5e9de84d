import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { ProofOfPotentialSection } from "@/components/candidate/proof-of-potential/ProofOfPotentialSection";
import { Star } from "lucide-react";

interface ProofOfPotentialPageSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function ProofOfPotentialPageSection({ userId, profileData, onSave }: ProofOfPotentialPageSectionProps) {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 text-amber-500" />
            <div>
              <GlowCardTitle>Proof of Potential</GlowCardTitle>
              <GlowCardDescription>
                Perfect for candidates aged 18-25 who want to showcase their potential beyond traditional experience.
                Show employers what makes you unique!
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
      </GlowCard>

      {/* Main Content */}
      <GlowCard>
        <GlowCardContent className="pt-6">
          <ProofOfPotentialSection
            userId={userId}
            initialData={(profileData as any)?.proof_of_potential || null}
          />
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
