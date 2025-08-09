
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
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger className="text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-primary" value="about">About</TabsTrigger>
          <TabsTrigger className="text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-primary" value="media">Gallery</TabsTrigger>
          <TabsTrigger className="text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-primary" value="jobs">Current Openings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="mt-6 bg-card p-6 rounded-md border shadow-sm">
          <AboutTabContent profile={profile} />
        </TabsContent>
        
        <TabsContent value="media" className="mt-6 bg-card p-6 rounded-md border shadow-sm">
          <CompanyMediaSection employerId={profile.id} galleryImages={galleryImages} />
        </TabsContent>
        
        <TabsContent value="jobs" className="mt-6 bg-card p-6 rounded-md border shadow-sm">
          <EmployerJobsList employerId={profile.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
