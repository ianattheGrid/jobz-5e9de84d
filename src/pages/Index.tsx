
import NavBar from "@/components/NavBar";
import { HeroSection } from "@/components/home/HeroSection";
import { PlatformFeatures } from "@/components/home/PlatformFeatures";
import { QRCodeSection } from "@/components/home/QRCodeSection";
import { DemoProfilesSection } from "@/components/home/DemoProfilesSection";
import { InternalE2ETestButton } from "@/components/dev/InternalE2ETestButton";


export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <HeroSection />
      
      <PlatformFeatures />
      <DemoProfilesSection />
      <QRCodeSection />
      <InternalE2ETestButton />
    </div>
  );
}
