
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileCard } from "@/components/shared/ProfileCard";
import { ProfileFormFields } from "./ProfileFormFields";
import { FileUploadSection } from "./FileUploadSection";
import { CompanyDetailsSection } from "./CompanyDetailsSection";
import { CompanyGallerySection } from "./CompanyGallerySection";
import { EmployerProfile } from "@/types/employer";

const urlSchema = z.union([
  z.string().url().or(z.literal('')),
  z.string().refine(
    (value) => {
      if (!value) return true;
      try {
        new URL(value.startsWith('http') ? value : `https://${value}`);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Please enter a valid URL" }
  )
]);

const formSchema = z.object({
  company_name: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  company_website: urlSchema,
  full_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  job_title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  company_size: z.number().optional(),
  company_description: z.string().max(1000, {
    message: "Company description cannot exceed 1000 characters",
  }).optional(),
  office_amenities: z.string().max(500, {
    message: "Office amenities cannot exceed 500 characters",
  }).optional(),
  nearby_amenities: z.string().max(500, {
    message: "Nearby amenities cannot exceed 500 characters",
  }).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

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
      company_name: profile.company_name,
      company_website: profile.company_website || "",
      full_name: profile.full_name,
      job_title: profile.job_title,
      company_size: profile.company_size || undefined,
      company_description: profile.company_description || "",
      office_amenities: profile.office_amenities || "",
      nearby_amenities: profile.nearby_amenities || "",
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

      // Format website URL if needed
      let formattedWebsite = values.company_website;
      if (formattedWebsite && !formattedWebsite.startsWith('http')) {
        formattedWebsite = `https://${formattedWebsite}`;
      }

      // Calculate SME status based on company size
      const isSME = values.company_size ? values.company_size <= 499 : false;

      const updateData = {
        id: session.user.id,
        company_name: values.company_name,
        company_website: formattedWebsite,
        full_name: values.full_name,
        job_title: values.job_title,
        company_size: values.company_size,
        company_description: values.company_description,
        office_amenities: values.office_amenities,
        nearby_amenities: values.nearby_amenities,
        is_sme: isSME, // Automatically set based on company size
      };

      const { error } = await supabase
        .from('employer_profiles')
        .upsert(updateData);

      if (error) throw error;

      setProfile({
        ...profile,
        ...updateData
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
        profilePicture={profile.profile_picture_url || undefined}
        additionalInfo={[
          { label: "Company", value: profile.company_name },
          { label: "Email", value: email },
          ...(profile.company_website ? [{ label: "Website", value: profile.company_website }] : [])
        ]}
      />

      <FileUploadSection 
        userId={profile.id}
        currentProfilePicture={profile.profile_picture_url}
        currentCompanyLogo={profile.company_logo_url}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-8">
            <ProfileFormFields control={form.control} />
            <CompanyDetailsSection control={form.control} />
            <CompanyGallerySection employerId={profile.id} />
            
            <Button 
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white w-full md:w-auto"
            >
              Update Profile
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
