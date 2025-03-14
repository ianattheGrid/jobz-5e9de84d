
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const testData = [
  {
    id: 1,
    created_at: '2024-02-15T10:00:00Z',
    jobs: {
      title: 'Frontend Developer',
      company: 'Tech Solutions Ltd',
      salary_min: 45000,
      salary_max: 65000
    }
  },
  {
    id: 2,
    created_at: '2024-02-05T09:00:00Z',
    jobs: {
      title: 'Senior Backend Engineer',
      company: 'Digital Innovations',
      salary_min: 65000,
      salary_max: 85000
    }
  },
  {
    id: 3,
    created_at: '2024-02-10T11:00:00Z',
    jobs: {
      title: 'Full Stack Developer',
      company: 'StartUp Next',
      salary_min: 55000,
      salary_max: 75000
    }
  }
];

export const useApplicationsList = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return testData;
      }

      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          created_at,
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

      return data.length > 0 ? data : testData;
    }
  });
};
