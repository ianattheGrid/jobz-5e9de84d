import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from "@/components/ui/glow-card";
import { CandidateGallerySection } from "@/components/candidate/gallery/CandidateGallerySection";
import { PortfolioSection } from "@/components/candidate/portfolio/PortfolioSection";
import { CreateFromCVButton } from "@/components/candidate/CreateFromCVButton";
import { FileUploadSection } from "@/components/candidate/FileUploadSection";

interface MediaSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function MediaSection({ userId, profileData, onSave }: MediaSectionProps) {
  return (
    <div className="space-y-6">
      {/* CV Section */}
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>CV / Resume</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          <FileUploadSection
            userId={userId}
            currentProfilePicture={profileData?.profile_picture_url || null}
            currentCV={profileData?.cv_url || null}
            onUploadComplete={onSave}
          />
          <div className="mt-4">
            <CreateFromCVButton
              cvUrl={profileData?.cv_url || null}
              userId={userId}
              onComplete={onSave}
            />
          </div>
        </GlowCardContent>
      </GlowCard>

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
