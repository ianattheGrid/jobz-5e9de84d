import { useState } from "react";
import NavBar from "@/components/NavBar";
import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { HowItWorksHero } from "@/components/home/HowItWorksHero";
import { PlatformFeatures } from "@/components/home/PlatformFeatures";
import { DemoProfilesSection } from "@/components/home/DemoProfilesSection";
import { CandidateCostSection } from "@/components/home/CandidateCostSection";
import { CandidateSectionHero } from "@/components/home/CandidateSectionHero";
import { InternalE2ETestButton } from "@/components/dev/InternalE2ETestButton";
import { Footer } from "@/components/Footer";


export default function Index() {
  const [activeTab, setActiveTab] = useState("hiring");

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <HeroSection />
      <MissionSection />
      <HowItWorksHero activeTab={activeTab} onTabChange={setActiveTab} />
      <PlatformFeatures activeTab={activeTab} />
      <CandidateSectionHero />
      <CandidateCostSection />
      <DemoProfilesSection />
      <InternalE2ETestButton />
      <Footer />
    </div>
  );
}
