import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileSectionId, PROFILE_SECTIONS } from "./types";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Eye, ArrowLeft, CreditCard, User } from "lucide-react";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CosmicBackground } from "@/components/ui/cosmic-background";

// Section components
import { AboutMeSection } from "./sections/AboutMeSection";
import { CareerStageSection } from "./sections/CareerStageSection";
import { PersonalityPageSection } from "./sections/PersonalityPageSection";
import { BonusSchemeSection } from "./sections/BonusSchemeSection";

import ProfileDetails from "@/components/candidate-profile/ProfileDetails";
import { CandidateCardPreview } from "./CandidateCardPreview";

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
  const [previewTab, setPreviewTab] = useState<'card' | 'profile'>('card');

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);

  // Calculate completed sections based on profile data
  useEffect(() => {
    if (!profileData) return;

    const completed = new Set<ProfileSectionId>();
    const profileAny = profileData as any;

    // About Me - check if basic info is filled (including education)
    if (profileData.full_name && profileData.email && profileData.home_postcode) {
      completed.add('about');
    }

    // Career Stage - check if primary stage is selected AND has stage-specific data
    if (profileAny.primary_career_stage) {
      const stage = profileAny.primary_career_stage;
      let hasStageData = false;
      
      if (stage === 'launchpad' && profileAny.proof_of_potential && Object.keys(profileAny.proof_of_potential).length > 0) {
        hasStageData = true;
      } else if (stage === 'ascent' && profileAny.ascent_profile && Object.keys(profileAny.ascent_profile).length > 0) {
        hasStageData = true;
      } else if (stage === 'core' && profileAny.core_profile && Object.keys(profileAny.core_profile).length > 0) {
        hasStageData = true;
      } else if (stage === 'pivot' && profileAny.second_chapter && Object.keys(profileAny.second_chapter).length > 0) {
        hasStageData = true;
      } else if (stage === 'encore' && profileAny.encore_profile && Object.keys(profileAny.encore_profile).length > 0) {
        hasStageData = true;
      }
      
      // Mark complete if stage is selected (questions are optional enhancement)
      completed.add('career-stage');
    }

    // Personality - check for personality data
    const personality = profileData.personality as any;
    if (personality && Object.keys(personality).length > 0) {
      completed.add('personality');
    }

    // Bonus Scheme - check if commission is set
    if (profileData.commission_percentage !== null) {
      completed.add('bonus-scheme');
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
      case 'career-stage':
        return <CareerStageSection {...commonProps} />;
      case 'personality':
        return <PersonalityPageSection {...commonProps} />;
      case 'bonus-scheme':
        return <BonusSchemeSection {...commonProps} />;
      default:
        return <AboutMeSection {...commonProps} />;
    }
  };

  const currentSectionInfo = PROFILE_SECTIONS.find(s => s.id === activeSection);

  if (showPreview && profileData) {
    return (
      <CosmicBackground mode="light">
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-10">
            <Button
              onClick={() => setShowPreview(false)}
              className="mb-6 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Editing
            </Button>

            <Tabs value={previewTab} onValueChange={(v) => setPreviewTab(v as 'card' | 'profile')} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                <TabsTrigger value="card" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Card View
                </TabsTrigger>
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  Full Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="mt-0">
                <div className="bg-amber-50/80 backdrop-blur-sm border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg">
                  <p className="font-medium text-slate-800">Swipe Card Preview</p>
                  <p className="text-sm text-slate-700">
                    This is how employers first see you when browsing candidates. Make a great first impression!
                  </p>
                </div>
                <div className="flex justify-center py-8">
                  <CandidateCardPreview profile={profileData} />
                </div>
              </TabsContent>

              <TabsContent value="profile" className="mt-0">
                <div className="bg-primary/10 backdrop-blur-sm border-l-4 border-primary p-4 mb-6 rounded-r-lg">
                  <p className="font-medium text-slate-800">Full Profile Preview</p>
                  <p className="text-sm text-slate-700">
                    This is how your profile appears to employers after they express interest and you reveal your details.
                  </p>
                </div>
                <ProfileDetails profile={profileData} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CosmicBackground>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <ProfileSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          completedSections={completedSections}
        />

        <SidebarInset className="flex-1">
          <CosmicBackground mode="light" className="min-h-full">
            {/* Header */}
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-primary/20 bg-white/80 backdrop-blur-md px-6">
              <SidebarTrigger className="-ml-2" />
              
              <div className="flex-1">
                <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
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
                  className="gap-2 border-primary/30 hover:bg-primary/10"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/candidate/dashboard')}
                  className="gap-2 bg-primary hover:bg-primary/90 text-white"
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
          </CosmicBackground>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
