
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useVRProfile } from "@/hooks/useVRProfile";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfileCard } from "@/components/shared/ProfileCard";
import { ProtectedRouteWithTimeout } from "@/components/auth/ProtectedRouteWithTimeout";
import { PreviewButton } from "@/components/vr/PreviewButton";

const formSchema = z.object({
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  location: z.string().min(2, { message: "Location must be at least 2 characters" }),
  national_insurance_number: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function VirtualRecruiterProfile() {
  const { profile, loading, updateProfile } = useVRProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      location: profile?.location || "",
      national_insurance_number: profile?.national_insurance_number || null,
    },
    values: {
      full_name: profile?.full_name || "",
      location: profile?.location || "",
      national_insurance_number: profile?.national_insurance_number || null,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await updateProfile(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProtectedRouteWithTimeout userType="vr">
      <div className="container mx-auto py-10 px-4">
        <div className="mb-6 flex justify-between items-center">
          <Button
            className="flex items-center gap-2 bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
            onClick={() => navigate("/vr/dashboard")}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <PreviewButton />
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Your Connector Profile</h1>

          {profile && (
            <div className="space-y-8">
              <ProfileCard
                fullName={profile.full_name}
                title="Connector"
                additionalInfo={[
                  { label: "Connect ID", value: profile.vr_number || "Not assigned" },
                  { label: "Email", value: profile.email || "" },
                  { label: "Location", value: profile.location || "" },
                  { label: "Bank Account Status", value: profile.bank_account_verified ? "Verified" : "Not Verified" },
                ]}
              />

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Update Profile Information</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="London, UK" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="national_insurance_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>National Insurance Number (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="AB123456C" 
                              {...field} 
                              value={field.value || ""} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Profile
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRouteWithTimeout>
  );
}
