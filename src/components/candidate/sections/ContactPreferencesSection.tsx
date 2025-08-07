import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { CandidateFormValues } from "../candidateFormSchema";

interface ContactPreferencesSectionProps {
  control: Control<CandidateFormValues>;
}

const ContactPreferencesSection = ({ control }: ContactPreferencesSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold border-l-4 border-primary pl-4 mb-4">
          Contact Preferences
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Let us know how employers and recruiters can contact you about opportunities.
        </p>
        
        <div className="space-y-4">
          <FormField
            control={control}
            name="contact_email_ok"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Email Contact</FormLabel>
                  <FormDescription>
                    Allow employers to contact you via email
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="contact_phone_ok"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Phone Contact</FormLabel>
                  <FormDescription>
                    Allow employers to contact you via phone
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="contact_linkedin_ok"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>LinkedIn Contact</FormLabel>
                  <FormDescription>
                    Allow employers to contact you via LinkedIn
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPreferencesSection;