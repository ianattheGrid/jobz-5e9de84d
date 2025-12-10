import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { GettingStartedSection } from "@/components/candidate/getting-started/GettingStartedSection";
import { Rocket } from "lucide-react";

interface GettingStartedPageSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function GettingStartedPageSection({ userId, profileData, onSave }: GettingStartedPageSectionProps) {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <Rocket className="h-6 w-6 text-primary" />
            <div>
              <GlowCardTitle>Getting Started</GlowCardTitle>
              <GlowCardDescription>
                Perfect for first-time job seekers who want to showcase their potential beyond traditional experience.
                Show employers what makes you unique!
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
      </GlowCard>

      {/* Main Content */}
      <GlowCard>
        <GlowCardContent className="pt-6">
          <GettingStartedSection
            userId={userId}
            initialData={(profileData as any)?.proof_of_potential || null}
          />
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
