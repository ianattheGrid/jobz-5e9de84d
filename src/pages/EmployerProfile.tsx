
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteAccountDialog } from "@/components/employer/DeleteAccountDialog";
import { ProfileForm } from "@/components/employer/ProfileForm";
import { useEmployerProfile } from "@/hooks/useEmployerProfile";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { PreviewButton } from "@/components/employer/PreviewButton";
import { CosmicBackground } from "@/components/ui/cosmic-background";

export default function EmployerProfile() {
  const { loading, profile, setProfile, email } = useEmployerProfile();

  if (loading) {
    return (
      <CosmicBackground mode="light">
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </CosmicBackground>
    );
  }

  return (
    <CosmicBackground mode="light">
      <div className="container mx-auto py-10 px-4">
      <div className="flex justify-end mb-4 gap-2">
        <PreviewButton />
        <Link to="/employer/dashboard">
          <Button 
            className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>

      <Card className="max-w-4xl mx-auto bg-white">
        <CardHeader>
          <div className="border-l-4 border-primary pl-6 mb-4">
            <CardTitle className="text-3xl font-bold text-gray-900">Employer Profile</CardTitle>
            <CardDescription className="text-gray-600 text-lg mt-2">
              Complete your profile to access all employer features
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <ProfileForm 
              profile={profile}
              setProfile={setProfile}
              email={email}
            />
            <div className="border-t pt-6">
              <DeleteAccountDialog />
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </CosmicBackground>
  );
}
