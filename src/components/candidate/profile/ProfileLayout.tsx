import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileSectionId, PROFILE_SECTIONS } from "./types";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Eye, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";

// Section components
import { AboutMeSection } from "./sections/AboutMeSection";
import { WorkPreferencesSection } from "./sections/WorkPreferencesSection";
import { SkillsExperienceSection } from "./sections/SkillsExperienceSection";
import { MediaSection } from "./sections/MediaSection";
import { SpecialSection } from "./sections/SpecialSection";
import { SettingsSection } from "./sections/SettingsSection";

import ProfileDetails from "@/components/candidate-profile/ProfileDetails";

interface ProfileLayoutProps {
  userId: string;
  profileData: CandidateProfile | null;
  onProfileUpdate: () => void;
}

export function ProfileLayout({ userId, profileData, onProfileUpdate }: ProfileLayoutProps) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<ProfileSectionId>('about');
  const [completedSections, setCompletedSections] = useState<Set<ProfileSectionId>>(new Set());
  const [showPreview, setShowPreview] = useState(false);

  // Calculate completed sections based on profile data
  useEffect(() => {
    if (!profileData) return;

    const completed = new Set<ProfileSectionId>();

    // About Me - check if basic info is filled
    if (profileData.full_name && profileData.email && profileData.home_postcode) {
      completed.add('about');
    }

    // Work Preferences - check for work area and salary
    if (profileData.workArea && profileData.min_salary && profileData.max_salary) {
      completed.add('work-preferences');
    }

    // Skills & Experience - check for skills or years experience
    if ((profileData.required_skills && profileData.required_skills.length > 0) || profileData.years_experience > 0) {
      completed.add('skills-experience');
    }

    // Media - check for any media content
    if (profileData.cv_url || profileData.profile_picture_url) {
      completed.add('media');
    }

    // Special - check for personality or proof of potential
    const personality = profileData.personality as any;
    if (personality && Object.keys(personality).length > 0) {
      completed.add('special');
    }

    // Settings - always consider complete if visible_sections exists
    const visibleSections = (profileData as any).visible_sections;
    if (visibleSections) {
      completed.add('settings');
    }

    setCompletedSections(completed);
  }, [profileData]);

  const renderSection = () => {
    const commonProps = {
      userId,
      profileData,
      onSave: onProfileUpdate
    };

    switch (activeSection) {
      case 'about':
        return <AboutMeSection {...commonProps} />;
      case 'work-preferences':
        return <WorkPreferencesSection {...commonProps} />;
      case 'skills-experience':
        return <SkillsExperienceSection {...commonProps} />;
      case 'media':
        return <MediaSection {...commonProps} />;
      case 'special':
        return <SpecialSection {...commonProps} />;
      case 'settings':
        return <SettingsSection {...commonProps} />;
      default:
        return <AboutMeSection {...commonProps} />;
    }
  };

  const currentSectionInfo = PROFILE_SECTIONS.find(s => s.id === activeSection);

  if (showPreview && profileData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-10">
          <Button
            onClick={() => setShowPreview(false)}
            className="mb-6 flex items-center gap-2"
            style={{ backgroundColor: '#FF69B4', color: 'white', border: 'none' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Editing
          </Button>

          <div className="bg-pink-100 border-l-4 border-pink-500 p-4 mb-6">
            <p className="font-medium text-slate-800">Preview Mode</p>
            <p className="text-sm text-slate-700">
              This is how your profile appears to employers after they request to view your details.
            </p>
          </div>

          <ProfileDetails profile={profileData} />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <ProfileSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          completedSections={completedSections}
        />

        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <SidebarTrigger className="-ml-2" />
            
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">
                {currentSectionInfo?.label || 'Profile'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentSectionInfo?.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/candidate/dashboard')}
                style={{ backgroundColor: '#FF69B4', color: 'white' }}
                className="gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-3xl mx-auto">
              {renderSection()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
