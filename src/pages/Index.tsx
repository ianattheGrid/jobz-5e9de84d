
import NavBar from "@/components/NavBar";
import { HeroSection } from "@/components/home/HeroSection";
import { PlatformFeatures } from "@/components/home/PlatformFeatures";
import { VideoSection } from "@/components/home/VideoSection";
import { CalculatorSection } from "@/components/home/CalculatorSection";
import { FAQSection } from "@/components/home/FAQSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <HeroSection />
      <PlatformFeatures />
      <VideoSection />
      {/* Even smaller spacer to reduce space between sections */}
      <div className="h-4"></div>
      <CalculatorSection />
      <FAQSection />
    </div>
  );
}
