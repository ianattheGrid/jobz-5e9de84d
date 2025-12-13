import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CandidateProfile, CareerBreak, AccessibilityInfo } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Link, Shield, MessageSquare, Sparkles, User, Info, ImageIcon, CalendarIcon, Car, GraduationCap, Briefcase, Trash2, Plus } from "lucide-react";
import { CreateFromCVButton } from "@/components/candidate/CreateFromCVButton";
import HomePostcodeSelect from "@/components/address/HomePostcodeSelect";
import { FileUploadSection } from "@/components/candidate/FileUploadSection";
import { VerificationSection } from "@/components/candidate/VerificationSection";
import { CandidateGallerySection } from "@/components/candidate/gallery/CandidateGallerySection";
import { AvailabilitySection } from "../components/AvailabilitySection";
import { CareerBreakSection } from "./CareerBreakSection";
import { AccessibilitySection } from "./AccessibilitySection";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const MAX_PERSONAL_STATEMENT_LENGTH = 1000;

const educationEntrySchema = z.object({
  institution: z.string().optional(),
  qualification: z.string().optional(),
  grade: z.string().optional(),
  year: z.number().optional(),
});

const aboutMeSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  home_postcode: z.string().min(1, "Please select your home postcode"),
  linkedin_url: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal('')),
  current_employer: z.string().optional(),
  date_of_birth: z.date().optional().nullable(),
  has_uk_driving_license: z.boolean().default(false),
  can_drive: z.boolean().default(false),
  contact_phone_ok: z.boolean().default(true),
  contact_email_ok: z.boolean().default(true),
  contact_linkedin_ok: z.boolean().default(false),
  contact_jobz_ok: z.boolean().default(true),
  personal_statement: z.string().max(MAX_PERSONAL_STATEMENT_LENGTH, `Maximum ${MAX_PERSONAL_STATEMENT_LENGTH} characters`).optional(),
  // Education
  education_details: z.array(educationEntrySchema).optional(),
  // Work Status
  is_currently_employed: z.boolean().default(true),
  notice_period: z.string().optional(),
  contract_type_preference: z.string().optional(),
});

type AboutMeFormValues = z.infer<typeof aboutMeSchema>;

interface AvailabilityData {
  earliest_start_date?: string | null;
}

interface AboutMeSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function AboutMeSection({ userId, profileData, onSave }: AboutMeSectionProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [availability, setAvailability] = useState<string>(
    profileData?.availability || ""
  );
  const availabilityData = (profileData as any)?.unavailable_dates as AvailabilityData | null;
  const [earliestStartDate, setEarliestStartDate] = useState<string | null>(
    availabilityData?.earliest_start_date || null
  );
  const profileAny = profileData as any;
  
  // Career Breaks & Accessibility state
  const [careerBreaks, setCareerBreaks] = useState<CareerBreak[]>(
    (profileAny?.career_breaks as CareerBreak[]) || []
  );
  const [accessibilityInfo, setAccessibilityInfo] = useState<AccessibilityInfo>(
    (profileAny?.accessibility_info as AccessibilityInfo) || {}
  );

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
      date_of_birth: profileAny?.date_of_birth ? new Date(profileAny.date_of_birth) : null,
      has_uk_driving_license: profileAny?.has_uk_driving_license ?? false,
      can_drive: profileAny?.can_drive ?? false,
      contact_phone_ok: profileAny?.contact_phone_ok ?? true,
      contact_email_ok: profileAny?.contact_email_ok ?? true,
      contact_linkedin_ok: profileAny?.contact_linkedin_ok ?? false,
      contact_jobz_ok: profileAny?.contact_jobz_ok ?? true,
      personal_statement: profileAny?.personal_statement || "",
      education_details: (profileAny?.education_details as any[]) || [],
      is_currently_employed: profileAny?.is_currently_employed ?? true,
      notice_period: profileAny?.notice_period || "",
      contract_type_preference: profileAny?.contract_type_preference || "permanent",
    },
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: form.control,
    name: "education_details",
  });

  const personalStatementValue = form.watch("personal_statement") || "";
  const characterCount = personalStatementValue.length;
  const isCurrentlyEmployed = form.watch("is_currently_employed");

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
          date_of_birth: values.date_of_birth ? values.date_of_birth.toISOString().split('T')[0] : null,
          has_uk_driving_license: values.has_uk_driving_license,
          can_drive: values.can_drive,
          contact_phone_ok: values.contact_phone_ok,
          contact_email_ok: values.contact_email_ok,
          contact_linkedin_ok: values.contact_linkedin_ok,
          contact_jobz_ok: values.contact_jobz_ok,
          personal_statement: values.personal_statement || null,
          availability: availability || null,
          unavailable_dates: earliestStartDate ? { earliest_start_date: earliestStartDate } : null,
          education_details: values.education_details || [],
          is_currently_employed: values.is_currently_employed,
          notice_period: values.notice_period || null,
          contract_type_preference: values.contract_type_preference || null,
          career_breaks: careerBreaks as any,
          accessibility_info: accessibilityInfo as any,
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

  const addEducation = () => {
    appendEducation({
      institution: "",
      qualification: "",
      grade: "",
      year: new Date().getFullYear(),
    });
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

      {/* CV / Resume - Optional */}
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>CV / Resume (Optional)</GlowCardTitle>
          <GlowCardDescription>
            Upload your CV to help employers understand your experience, or skip this if you prefer.
          </GlowCardDescription>
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

      {/* Gallery Section */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <GlowCardTitle className="text-lg">Gallery</GlowCardTitle>
              <GlowCardDescription>
                You are more than words—show the human element
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
        <GlowCardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Add photos of hobbies, projects, or activities that showcase who you are beyond your CV.
          </p>
          <CandidateGallerySection candidateId={userId} />
          <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-muted/50 border border-border">
            <Info className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              Gallery images save automatically when you upload or delete them.
            </p>
          </div>
        </GlowCardContent>
      </GlowCard>

      {/* Education Section */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
            <div>
              <GlowCardTitle className="text-lg">Education & Qualifications</GlowCardTitle>
              <GlowCardDescription>
                Add your educational background to help employers understand your qualifications
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
        <GlowCardContent>
          <Form {...form}>
            <div className="space-y-4">
              {educationFields.map((field, index) => (
                <Card key={field.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        Education #{index + 1}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`education_details.${index}.institution`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., University of Bristol" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education_details.${index}.qualification`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qualification</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., BSc Computer Science" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`education_details.${index}.grade`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2:1, First Class" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education_details.${index}.year`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g., 2020" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addEducation}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
          </Form>
        </GlowCardContent>
      </GlowCard>

      {/* Work Status Section */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <div>
              <GlowCardTitle className="text-lg">Work Status</GlowCardTitle>
              <GlowCardDescription>
                Let employers know your current employment situation
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
        <GlowCardContent>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="is_currently_employed"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      I am currently employed
                    </FormLabel>
                  </FormItem>
                )}
              />

              {isCurrentlyEmployed && (
                <FormField
                  control={form.control}
                  name="notice_period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notice Period</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your notice period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Immediate">Immediate</SelectItem>
                          <SelectItem value="1 week">1 week</SelectItem>
                          <SelectItem value="2 weeks">2 weeks</SelectItem>
                          <SelectItem value="1 month">1 month</SelectItem>
                          <SelectItem value="2 months">2 months</SelectItem>
                          <SelectItem value="3 months">3 months</SelectItem>
                          <SelectItem value="3+ months">3+ months</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="contract_type_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Type Preference</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="any">Open to all</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </GlowCardContent>
      </GlowCard>

      {/* Availability */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <GlowCardTitle className="text-lg">Availability</GlowCardTitle>
              <GlowCardDescription>
                Let employers know when you can start
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
        <GlowCardContent>
          <AvailabilitySection
            availability={availability}
            onAvailabilityChange={setAvailability}
            earliestStartDate={earliestStartDate}
            onEarliestStartDateChange={setEarliestStartDate}
          />
        </GlowCardContent>
      </GlowCard>

      {/* Career Break Section - Collapsible */}
      <CareerBreakSection
        careerBreaks={careerBreaks}
        onCareerBreaksChange={setCareerBreaks}
      />

      {/* Accessibility Section - Collapsible */}
      <AccessibilitySection
        accessibilityInfo={accessibilityInfo}
        onAccessibilityInfoChange={setAccessibilityInfo}
      />
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

              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select your date of birth</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1940-01-01")
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                          captionLayout="dropdown-buttons"
                          fromYear={1940}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
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

              {/* Driving Section */}
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">Driving</h4>
                </div>
                
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="has_uk_driving_license"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          I hold a full UK driving license
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="can_drive"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          I'm able to drive for work if required
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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
