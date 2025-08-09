
import NavBar from "@/components/NavBar";
import { HeroSection } from "@/components/home/HeroSection";
import { PlatformFeatures } from "@/components/home/PlatformFeatures";
import { CostCalculatorSection } from "@/components/home/CostCalculatorSection";
import { QRCodeSection } from "@/components/home/QRCodeSection";
import { DemoProfilesSection } from "@/components/home/DemoProfilesSection";
import { ConnectorExplainer } from "@/components/home/ConnectorExplainer";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <HeroSection />
      <ConnectorExplainer />
      <PlatformFeatures />
      <CostCalculatorSection />
      <DemoProfilesSection />
      <QRCodeSection />
    </div>
  );
}
