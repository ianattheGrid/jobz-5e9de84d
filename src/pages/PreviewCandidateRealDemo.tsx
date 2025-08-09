import NavBar from "@/components/NavBar";
import ProfileDetails from "@/components/candidate-profile/ProfileDetails";
import type { CandidateProfile } from "@/integrations/supabase/types/profiles";
import sarahProfileImage from "@/assets/sarah-johnson-profile.jpg";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PreviewCandidateRealDemo() {
  const profile: CandidateProfile = {
    id: "demo-candidate-1",
    email: "sarah.johnson@example.com",
    job_title: ["Senior Frontend Developer"],
    years_experience: 5,
    location: ["Bristol, UK"],
    min_salary: 55000,
    max_salary: 70000,
    required_qualifications: ["BSc Computer Science"],
    required_skills: ["React", "TypeScript", "Tailwind CSS"],
    security_clearance: null,
    commission_percentage: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    signup_date: null,
    work_eligibility: "UK Citizen",
    preferred_work_type: "Hybrid",
    availability: "Available immediately",
    additional_skills: "Next.js, Node.js, Jest",
    address: null,
    ai_synopsis: "Passionate frontend developer with 5+ years of experience building responsive web applications using React, TypeScript, and modern CSS.",
    ai_synopsis_last_updated: null,
    ai_synopsis_status: null,
    current_employer: "TechHub Bristol",
    cv_url: null,
    full_name: "Sarah Johnson",
    phone_number: "+44 117 456 7890",
    profile_picture_url: sarahProfileImage,
    travel_radius: 30,
    work_preferences: "Product teams, strong design culture",
    desired_job_title: "Senior Frontend Developer",
    home_postcode: null,
    linkedin_url: "https://linkedin.com/in/example",
    years_in_current_title: 2,
    title_experience: null,
    workArea: null,
    itSpecialization: null,
    personality: [
      { question_key: "holiday", question_label: "Best holiday I’ve taken", answer: "Road-tripping the Scottish Highlands in autumn." },
      { question_key: "book", question_label: "Favorite book", answer: "Atomic Habits — small wins, big results." }
    ],
  };

  return (
    <div className="min-h-screen bg-background demo-candidate-dark">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-5xl" style={{ paddingTop: '80px' }}>
        <div className="mb-4">
          <Link to="/demo/candidate" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Demo Candidate</span>
          </Link>
        </div>

        <ProfileDetails profile={profile} />
      </div>
    </div>
  );
}
