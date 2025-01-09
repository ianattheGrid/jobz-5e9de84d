import { HeroSection } from "@/components/home/HeroSection";
import { PlatformFeatures } from "@/components/home/PlatformFeatures";
import { SignUpSection } from "@/components/home/SignUpSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <HeroSection />
      <PlatformFeatures />
      <SignUpSection />
    </div>
  );
}