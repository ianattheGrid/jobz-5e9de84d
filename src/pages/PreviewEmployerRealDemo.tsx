import NavBar from "@/components/NavBar";
import { EmployerProfileHeader } from "@/components/employer/public-profile/EmployerProfileHeader";
import { ProfileTabs } from "@/components/employer/public-profile/ProfileTabs";
import type { EmployerProfile, CompanyGalleryImage } from "@/types/employer";
import gallery1 from "@/assets/employer-gallery-1.jpg";
import gallery2 from "@/assets/employer-gallery-2.jpg";
import gallery3 from "@/assets/employer-gallery-3.jpg";
import gallery4 from "@/assets/employer-gallery-4.jpg";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PreviewEmployerRealDemo() {
  const profile: EmployerProfile = {
    id: "demo-employer-1",
    company_name: "Bristol Tech Solutions",
    company_website: "https://www.bristoltech.co.uk",
    company_logo_url: null,
    full_name: "Jane Doe",
    job_title: "Head of People",
    company_size: 200,
    is_sme: true,
    company_description:
      "Bristol Tech Solutions is a fast-growing software company specializing in cloud-native solutions and AI-powered analytics. We're passionate about innovation and building products that make a real difference in our clients' businesses.",
    office_amenities: "Modern office, standing desks, breakout spaces, barista coffee.",
    nearby_amenities: "Harbourside cafes, cycle paths, and city-center transport.",
    industry_sector: "Software Development",
    company_address: "Bristol, UK",
    company_postcode: "BS1 5TT",
    remote_work_policy: "Hybrid-first with remote options",
    company_culture:
      "We believe in work-life balance, continuous learning, and collaborative innovation. Our team is diverse, inclusive, and driven by curiosity.",
    company_values: ["Innovation", "Collaboration", "Integrity", "Growth Mindset", "Customer Focus"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const galleryImages: CompanyGalleryImage[] = [gallery1, gallery2, gallery3, gallery4].map((url, i) => ({
    id: `img-${i+1}`,
    employer_id: profile.id,
    image_url: url,
    created_at: new Date().toISOString(),
  }));

  return (
    <div className="min-h-screen bg-background demo-employer-dark">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-6xl" style={{ paddingTop: '80px' }}>
        <div className="mb-4">
          <Link to="/demo/employer" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Demo Employer</span>
          </Link>
        </div>

        <div className="rounded-lg shadow-lg overflow-hidden">
          <EmployerProfileHeader profile={profile} />
          <ProfileTabs profile={profile} galleryImages={galleryImages} />
        </div>
      </div>
    </div>
  );
}
