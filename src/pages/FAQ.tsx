import NavBar from "@/components/NavBar";
import { FAQSection } from "@/components/home/FAQSection";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="pt-16">
        <FAQSection />
      </div>
    </div>
  );
}