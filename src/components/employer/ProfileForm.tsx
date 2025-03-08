import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileCard } from "@/components/shared/ProfileCard";
import { ProfileFormFields } from "./ProfileFormFields";

const formSchema = z.object({
  company_name: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  full_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  job_title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  linkedin_url: z.string().url().optional().or(z.literal('')),
});

export type FormValues = z.infer<typeof formSchema>;

interface EmployerProfile {
  company_name: string;
  full_name: string;
  job_title: string;
  linkedin_url?: string;
}

interface ProfileFormProps {
  profile: EmployerProfile;
  setProfile: (profile: EmployerProfile) => void;
  email: string;
}

export function ProfileForm({ profile, setProfile, email }: ProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: profile.company_name || "",
      full_name: profile.full_name || "",
      job_title: profile.job_title || "",
      linkedin_url: profile.linkedin_url || "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to update your profile"
        });
        return;
      }

      const dbValues = {
        id: session.user.id,
        company_name: values.company_name,
        full_name: values.full_name,
        job_title: values.job_title,
        linkedin_url: values.linkedin_url,
      };

      const { error } = await supabase
        .from('employer_profiles')
        .upsert(dbValues);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to update profile",
        });
        return;
      }

      setProfile({
        company_name: values.company_name,
        full_name: values.full_name,
        job_title: values.job_title,
        linkedin_url: values.linkedin_url,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    }
  }

  return (
    <div className="space-y-8">
      <ProfileCard
        fullName={profile.full_name}
        title={profile.job_title}
        additionalInfo={[
          { label: "Company", value: profile.company_name },
          { label: "Email", value: email },
          ...(profile.linkedin_url ? [{ label: "LinkedIn", value: profile.linkedin_url }] : [])
        ]}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ProfileFormFields control={form.control} />
          <Button 
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white w-full md:w-auto"
          >
            Update Profile
          </Button>
        </form>
      </Form>
    </div>
  );
}
