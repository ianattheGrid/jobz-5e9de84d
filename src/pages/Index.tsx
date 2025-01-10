import NavBar from "@/components/NavBar";
import { HeroSection } from "@/components/home/HeroSection";
import { PlatformFeatures } from "@/components/home/PlatformFeatures";
import { SignUpSection } from "@/components/home/SignUpSection";
import { CalculatorSection } from "@/components/home/CalculatorSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <NavBar />
      <HeroSection />
      <PlatformFeatures />
      <CalculatorSection />
      <SignUpSection />
    </div>
  );
}