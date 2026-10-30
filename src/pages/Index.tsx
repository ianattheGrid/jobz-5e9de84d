import { useState } from "react";
import NavBar from "@/components/NavBar";
import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { WebbySection } from "@/components/home/WebbySection";
import { HowItWorksHero } from "@/components/home/HowItWorksHero";
import { PlatformFeatures } from "@/components/home/PlatformFeatures";
import { DemoProfilesSection } from "@/components/home/DemoProfilesSection";
import { CandidateCostSection } from "@/components/home/CandidateCostSection";
import { CandidateSectionHero } from "@/components/home/CandidateSectionHero";
import { CandidateFrontDoorSection } from "@/components/home/CandidateFrontDoorSection";
import { AnonymousTalentPreview } from "@/components/home/AnonymousTalentPreview";

import { ProfilePathwaysSection } from "@/components/home/ProfilePathwaysSection";
import CostComparisonVisual from "@/components/home/CostComparisonVisual";
import { MiddlemenComparisonSection } from "@/components/home/MiddlemenComparisonSection";
import { CosmicDivider } from "@/components/home/CosmicDivider";
import { InternalE2ETestButton } from "@/components/dev/InternalE2ETestButton";
import { Footer } from "@/components/Footer";
import { SoftLaunchBanner } from "@/components/SoftLaunchBanner";
import { useBetaPreview } from "@/components/beta/BetaPreview";

export default function Index() {
  const { isOwner } = useBetaPreview();
  const [activeTab, setActiveTab] = useState("hiring");

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <HeroSection />
      <MissionSection />
      <HowItWorksHero activeTab={activeTab} onTabChange={setActiveTab} />
      <PlatformFeatures activeTab={activeTab} />
      <CandidateSectionHero />
      <CandidateFrontDoorSection />
      <AnonymousTalentPreview />

      <ProfilePathwaysSection />
      <CostComparisonVisual />
      <MiddlemenComparisonSection />
      <CosmicDivider />
      <CandidateCostSection />
      <WebbySection />
      <DemoProfilesSection />
      {isOwner && <InternalE2ETestButton />}
      <Footer />
    </div>
  );
}
