import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SearchForm } from "@/components/candidate-search/SearchForm";
import { SearchResults } from "@/components/candidate-search/SearchResults";
import { searchFormSchema } from "@/components/candidate-search/searchFormSchema";
import type { z } from "zod";

interface CandidateProfile {
  id: string;
  job_title: string;
  years_experience: number;
  location: string;
  min_salary: number;
  max_salary: number;
}

export default function CandidateSearch() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.user_metadata.user_type !== 'employer') {
        navigate('/employer/signin');
        return;
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while checking authentication",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof searchFormSchema>) => {
    try {
      const [minSalary, maxSalary] = values.salary.split(" - ").map(s => 
        parseInt(s.replace(/[£,]/g, ""))
      );

      const { data: candidateProfiles, error } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('location', values.location)
        .gte('min_salary', minSalary)
        .lte('max_salary', maxSalary);

      if (error) throw error;

      setCandidates(candidateProfiles);
      toast({
        title: "Search Completed",
        description: `Found ${candidateProfiles.length} matching candidates.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search candidates. Please try again.",
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  return (
    <div className="container max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-left text-red-800">Search Candidate Database</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <SearchForm onSubmit={onSubmit} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <SearchResults candidates={candidates} />
        </div>
      </div>
    </div>
  );
}