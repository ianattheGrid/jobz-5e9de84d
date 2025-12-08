import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { RefreshCw, Construction } from "lucide-react";

interface SecondChapterSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function SecondChapterSection({ userId, profileData, onSave }: SecondChapterSectionProps) {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <RefreshCw className="h-6 w-6 text-emerald-500" />
            <div>
              <GlowCardTitle>Second Chapter</GlowCardTitle>
              <GlowCardDescription>
                Looking for a career change? This section helps employers understand your transferable skills 
                and what you're looking for in your next role.
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
      </GlowCard>

      {/* Coming Soon Placeholder */}
      <GlowCard>
        <GlowCardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Construction className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Coming Soon</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              The Second Chapter form is being developed. This will allow you to showcase your 
              transferable skills and career transition goals to potential employers.
            </p>
          </div>
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
