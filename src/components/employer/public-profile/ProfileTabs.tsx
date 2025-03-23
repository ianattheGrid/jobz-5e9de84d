
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AboutTabContent } from "./AboutTabContent";
import { CompanyMediaSection } from "./CompanyMediaSection";
import { EmployerJobsList } from "./EmployerJobsList";
import type { EmployerProfile, CompanyGalleryImage } from "@/types/employer";

interface ProfileTabsProps {
  profile: EmployerProfile;
  galleryImages: CompanyGalleryImage[];
}

export const ProfileTabs = ({ profile, galleryImages }: ProfileTabsProps) => {
  return (
    <div className="mt-8">
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="media">Gallery</TabsTrigger>
          <TabsTrigger value="jobs">Current Openings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="mt-6 bg-white p-6 rounded-md border border-gray-100 shadow-sm">
          <AboutTabContent profile={profile} />
        </TabsContent>
        
        <TabsContent value="media" className="mt-6 bg-white p-6 rounded-md border border-gray-100 shadow-sm">
          <CompanyMediaSection employerId={profile.id} galleryImages={galleryImages} />
        </TabsContent>
        
        <TabsContent value="jobs" className="mt-6 bg-white p-6 rounded-md border border-gray-100 shadow-sm">
          <EmployerJobsList employerId={profile.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
