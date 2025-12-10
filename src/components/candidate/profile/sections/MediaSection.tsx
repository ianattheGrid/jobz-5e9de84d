import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from "@/components/ui/glow-card";
import { CandidateGallerySection } from "@/components/candidate/gallery/CandidateGallerySection";
import { PortfolioSection } from "@/components/candidate/portfolio/PortfolioSection";
import { Info } from "lucide-react";

interface MediaSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function MediaSection({ userId, profileData, onSave }: MediaSectionProps) {
  return (
    <div className="space-y-6">
      {/* Auto-save info banner */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
        <Info className="h-5 w-5 text-muted-foreground shrink-0" />
        <p className="text-sm text-muted-foreground">
          Gallery and portfolio items save automatically when you upload or delete them.
        </p>
      </div>

      {/* Gallery Section */}
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>Gallery</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Add photos that showcase your work environment, projects, or professional activities.
          </p>
          <CandidateGallerySection candidateId={userId} />
        </GlowCardContent>
      </GlowCard>

      {/* Portfolio Section */}
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>Portfolio</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          <PortfolioSection userId={userId} />
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
