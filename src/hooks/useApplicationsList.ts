
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useApplicationsList = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session found');
      }

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (
            title,
            company,
            salary_min,
            salary_max
          )
        `)
        .eq('applicant_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load applications",
        });
        throw error;
      }

      return data;
    }
  });
};
