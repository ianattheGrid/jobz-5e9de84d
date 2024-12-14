import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { EmployerProfile } from "@/types/employer";

interface ProfileFormProps {
  profile: EmployerProfile;
  setProfile: (profile: EmployerProfile) => void;
  email: string;
}

export const ProfileForm = ({ profile, setProfile, email }: ProfileFormProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('employer_profiles')
        .upsert({
          id: session.user.id,
          ...profile
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="company-name">
            Company Name
          </label>
          <Input
            id="company-name"
            value={profile.company_name}
            onChange={(e) =>
              setProfile({ ...profile, company_name: e.target.value })
            }
          />
        </div>
        <div className="col-span-2">
          <div className="h-full flex items-end">
            <span className="text-sm text-gray-500">
              This will be displayed on your job postings
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="full-name">
            Full Name
          </label>
          <Input
            id="full-name"
            value={profile.full_name}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
          />
        </div>
        <div className="col-span-2">
          <div className="h-full flex items-end">
            <span className="text-sm text-gray-500">
              Your name as the company representative
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="job-title">
            Job Title
          </label>
          <Input
            id="job-title"
            value={profile.job_title}
            onChange={(e) =>
              setProfile({ ...profile, job_title: e.target.value })
            }
          />
        </div>
        <div className="col-span-2">
          <div className="h-full flex items-end">
            <span className="text-sm text-gray-500">
              Your role within the company
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email Address
          </label>
          <Input id="email" value={email} disabled />
        </div>
        <div className="col-span-2">
          <div className="h-full flex items-end">
            <span className="text-sm text-gray-500">
              Your account email (cannot be changed)
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-red-800 hover:bg-red-900"
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};