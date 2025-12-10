import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { Loader2, Save, Link, Shield, MessageSquare, Sparkles, User, FileText } from "lucide-react";
import { CreateFromCVButton } from "@/components/candidate/CreateFromCVButton";
import HomePostcodeSelect from "@/components/address/HomePostcodeSelect";
import { FileUploadSection } from "@/components/candidate/FileUploadSection";
import { VerificationSection } from "@/components/candidate/VerificationSection";

const MAX_PERSONAL_STATEMENT_LENGTH = 1000;

const aboutMeSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  home_postcode: z.string().min(1, "Please select your home postcode"),
  linkedin_url: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal('')),
  current_employer: z.string().optional(),
  contact_phone_ok: z.boolean().default(true),
  contact_email_ok: z.boolean().default(true),
  contact_linkedin_ok: z.boolean().default(false),
  contact_jobz_ok: z.boolean().default(true),
  personal_statement: z.string().max(MAX_PERSONAL_STATEMENT_LENGTH, `Maximum ${MAX_PERSONAL_STATEMENT_LENGTH} characters`).optional(),
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
  const [isEnhancing, setIsEnhancing] = useState(false);
  const profileAny = profileData as any;

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
      contact_phone_ok: profileAny?.contact_phone_ok ?? true,
      contact_email_ok: profileAny?.contact_email_ok ?? true,
      contact_linkedin_ok: profileAny?.contact_linkedin_ok ?? false,
      contact_jobz_ok: profileAny?.contact_jobz_ok ?? true,
      personal_statement: profileAny?.personal_statement || "",
    },
  });

  const personalStatementValue = form.watch("personal_statement") || "";
  const characterCount = personalStatementValue.length;

  const handleEnhanceWithAI = async () => {
    const currentText = form.getValues("personal_statement");
    
    if (!currentText || currentText.trim().length === 0) {
      toast({
        variant: "destructive",
        title: "Nothing to enhance",
        description: "Please write something first, then use AI to enhance it.",
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const { data, error } = await supabase.functions.invoke('enhance-about-me', {
        body: { text: currentText }
      });

      if (error) throw error;

      if (data?.enhancedText) {
        form.setValue("personal_statement", data.enhancedText);
        toast({
          title: "Text enhanced",
          description: "Your personal statement has been improved. Review the changes and save when ready.",
        });
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('AI enhancement error:', error);
      toast({
        variant: "destructive",
        title: "Enhancement failed",
        description: error.message || "Failed to enhance text. Please try again.",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

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
          contact_phone_ok: values.contact_phone_ok,
          contact_email_ok: values.contact_email_ok,
          contact_linkedin_ok: values.contact_linkedin_ok,
          contact_jobz_ok: values.contact_jobz_ok,
          personal_statement: values.personal_statement || null,
        })
        .eq('id', userId);

      if (error) throw error;

      toast({ title: "Success", description: "About me information saved" });
      onSave();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>Profile Picture</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          <FileUploadSection
            userId={userId}
            currentProfilePicture={profileData?.profile_picture_url || null}
            currentCV={profileData?.cv_url || null}
            onUploadComplete={onSave}
            showProfilePicture={true}
            showCV={false}
          />
        </GlowCardContent>
      </GlowCard>

      {/* CV / Resume */}
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>CV / Resume</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          <FileUploadSection
            userId={userId}
            currentProfilePicture={profileData?.profile_picture_url || null}
            currentCV={profileData?.cv_url || null}
            onUploadComplete={onSave}
            showProfilePicture={false}
            showCV={true}
          />
          <div className="mt-4">
            <CreateFromCVButton
              cvUrl={profileData?.cv_url || null}
              userId={userId}
              onComplete={onSave}
            />
          </div>
        </GlowCardContent>
      </GlowCard>

      {/* Identity Verification */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div>
              <GlowCardTitle className="text-lg">Identity Verification</GlowCardTitle>
              <GlowCardDescription>
                Verify your identity to build trust with employers
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
        <GlowCardContent>
          <VerificationSection />
        </GlowCardContent>
      </GlowCard>

      {/* About Me Free Text */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <GlowCardTitle className="text-lg">About Me</GlowCardTitle>
              <GlowCardDescription>
                Tell employers about yourself, your motivations, and what makes you unique
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
        <GlowCardContent>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="personal_statement"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Write a few sentences about yourself, your career journey, what you're passionate about, and what you're looking for in your next role..."
                        className="min-h-[150px] resize-none"
                        maxLength={MAX_PERSONAL_STATEMENT_LENGTH}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between">
                      <FormMessage />
                      <span className={`text-sm ${characterCount > MAX_PERSONAL_STATEMENT_LENGTH * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {characterCount}/{MAX_PERSONAL_STATEMENT_LENGTH} characters
                      </span>
                    </div>
                  </FormItem>
                )}
              />
              
              <Button
                type="button"
                variant="outline"
                onClick={handleEnhanceWithAI}
                disabled={isEnhancing || !personalStatementValue.trim()}
                className="w-full sm:w-auto"
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Enhance with AI
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                AI will improve your text while keeping your authentic voice. You can review and edit the result before saving.
              </p>
            </div>
          </Form>
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

              {/* Contact Preferences */}
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">Contact Preferences</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose how employers can contact you
                </p>
                
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="contact_email_ok"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Employers can contact me by email
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_phone_ok"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Employers can contact me by phone
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_linkedin_ok"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Employers can contact me via LinkedIn
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_jobz_ok"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Employers can contact me via Jobz messages
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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
                      Save About Me Information
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
