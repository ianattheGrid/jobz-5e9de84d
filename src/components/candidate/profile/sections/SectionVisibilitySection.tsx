import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { SectionVisibilityToggles } from "@/components/candidate/SectionVisibilityToggles";
import { Eye } from "lucide-react";

interface SectionVisibilitySectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function SectionVisibilitySection({ userId, profileData, onSave }: SectionVisibilitySectionProps) {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-primary" />
            <div>
              <GlowCardTitle>Section Visibility</GlowCardTitle>
              <GlowCardDescription>
                Control which sections of your profile are visible to employers when they view your full profile.
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
      </GlowCard>

      {/* Main Content */}
      <GlowCard>
        <GlowCardContent className="pt-6">
          <SectionVisibilityToggles
            userId={userId}
            initial={(profileData as any)?.visible_sections || null}
            onChange={onSave}
          />
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
