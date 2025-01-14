import { toast } from "@/components/ui/use-toast";
import { CandidateFormValues } from "@/components/candidate/candidateFormSchema";
import { supabase } from "@/integrations/supabase/client";

type ToastFunction = typeof toast;

export const useProfileSubmit = (toast: ToastFunction) => {
  const onSubmit = async (values: CandidateFormValues) => {
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

      console.log("Submitting profile data:", values);

      // Only include non-empty values in the update
      const updateData: Partial<CandidateFormValues> = {};
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          updateData[key] = value;
        }
      });

      const { error } = await supabase
        .from('candidate_profiles')
        .upsert({
          id: session.user.id,
          ...updateData
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to update profile. Please try again."
        });
        return;
      }

      console.log('Profile updated successfully');
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while updating your profile"
      });
    }
  };

  return { onSubmit };
};