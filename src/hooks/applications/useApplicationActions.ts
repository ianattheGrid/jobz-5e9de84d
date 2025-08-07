import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useApplicationActions = (onSuccess: () => void) => {
  const { toast } = useToast();

  const handleAccept = async (applicationId: number) => {
    const { error } = await supabase
      .from('applications')
      .update({ 
        employer_accepted: true,
        employer_viewed_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept application",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Application accepted",
    });
    
    onSuccess();
  };

  const handleReject = async (applicationId: number, reason: string, notes?: string) => {
    const { error } = await supabase
      .from('applications')
      .update({ 
        employer_accepted: false,
        employer_viewed_at: new Date().toISOString(),
        rejection_reason: reason,
        rejection_notes: notes
      })
      .eq('id', applicationId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject application",
      });
      return;
    }

    toast({
      title: "Application Rejected",
      description: "The candidate has been notified",
    });
    
    onSuccess();
  };

  return { handleAccept, handleReject };
};