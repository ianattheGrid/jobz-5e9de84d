import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from "@/components/ui/glow-card";
import { Loader2, Save, Link } from "lucide-react";
import HomePostcodeSelect from "@/components/address/HomePostcodeSelect";
import { FileUploadSection } from "@/components/candidate/FileUploadSection";

const aboutMeSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  home_postcode: z.string().min(1, "Please select your home postcode"),
  linkedin_url: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal('')),
  current_employer: z.string().optional(),
});

type AboutMeFormValues = z.infer<typeof aboutMeSchema>;

interface AboutMeSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function AboutMeSection({ userId, profileData, onSave }: AboutMeSectionProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AboutMeFormValues>({
    resolver: zodResolver(aboutMeSchema),
    defaultValues: {
      full_name: profileData?.full_name || "",
      email: profileData?.email || "",
      phone_number: profileData?.phone_number || "",
      address: profileData?.address || "",
      home_postcode: profileData?.home_postcode || "",
      linkedin_url: profileData?.linkedin_url || "",
      current_employer: profileData?.current_employer || "",
    },
  });

  const handleSubmit = async (values: AboutMeFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('candidate_profiles')
        .update({
          full_name: values.full_name,
          email: values.email,
          phone_number: values.phone_number || null,
          address: values.address || null,
          home_postcode: values.home_postcode,
          linkedin_url: values.linkedin_url || null,
          current_employer: values.current_employer || null,
        })
        .eq('id', userId);

      if (error) throw error;

      toast({ title: "Success", description: "Contact information saved" });
      onSave();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture & CV */}
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>Profile Picture & CV</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          <FileUploadSection
            userId={userId}
            currentProfilePicture={profileData?.profile_picture_url || null}
            currentCV={profileData?.cv_url || null}
            onUploadComplete={onSave}
          />
        </GlowCardContent>
      </GlowCard>

      {/* Contact Information Form */}
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>Contact Information</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="url"
                          placeholder="https://www.linkedin.com/in/your-profile"
                          className="pl-10"
                          {...field}
                        />
                        <Link className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="current_employer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Employer</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your current employer's name" {...field} />
                    </FormControl>
                    <p className="text-sm text-muted-foreground mt-1">
                      This helps us ensure you don't accidentally apply to positions at your current company
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <HomePostcodeSelect control={form.control} />

              <div className="pt-4">
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Contact Information
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
