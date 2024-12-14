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

export default function EmployerProfile() {
  const { loading, profile, setProfile, email } = useEmployerProfile();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Employer Profile</CardTitle>
          <CardDescription>
            Manage your profile information and account settings
          </CardDescription>
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
  );
}