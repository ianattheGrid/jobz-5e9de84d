
import NavBar from "@/components/NavBar";
import { HeroSection } from "@/components/home/HeroSection";
import { PlatformFeatures } from "@/components/home/PlatformFeatures";
import { VideoSection } from "@/components/home/VideoSection";
import { CalculatorSection } from "@/components/home/CalculatorSection";
import { QRCodeSection } from "@/components/home/QRCodeSection";
import { ContractorRecruitmentSection } from "@/components/home/ContractorRecruitmentSection";
import { ContractorCalculatorSection } from "@/components/home/ContractorCalculatorSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <HeroSection />
      <PlatformFeatures />
      <VideoSection />
      <div className="h-4"></div>
      <CalculatorSection />
      <QRCodeSection />
      <ContractorRecruitmentSection />
      <ContractorCalculatorSection />
    </div>
  );
}
