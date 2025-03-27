
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
      {/* Reduced spacer div to create less space between sections */}
      <div className="h-8"></div>
      <CalculatorSection />
      <FAQSection />
    </div>
  );
}
