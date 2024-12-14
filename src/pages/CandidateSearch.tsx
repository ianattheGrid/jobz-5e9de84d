import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationField from "@/components/LocationField";
import WorkAreaField from "@/components/WorkAreaField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  yearsExperience: z.string({
    required_error: "Please select required years of experience.",
  }),
  workArea: z.string({
    required_error: "Please select the area of work.",
  }),
  otherWorkArea: z.string().optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  minSalary: z.string().min(1, {
    message: "Minimum salary is required",
  }),
  maxSalary: z.string().min(1, {
    message: "Maximum salary is required",
  }),
});

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      yearsExperience: "",
      workArea: "",
      location: "",
      minSalary: "",
      maxSalary: "",
    },
  });

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: candidateProfiles, error } = await supabase
        .from('candidate_profiles')
        .select('*')
        .gte('years_experience', parseInt(values.yearsExperience))
        .gte('min_salary', parseInt(values.minSalary))
        .lte('max_salary', parseInt(values.maxSalary))
        .ilike('job_title', `%${values.title}%`)
        .eq('location', values.location);

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-left">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior React Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearsExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Years of Experience Required</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select required experience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(19)].map((_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1} {i === 0 ? 'year' : 'years'}
                          </SelectItem>
                        ))}
                        <SelectItem value="20+">20+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <WorkAreaField control={form.control} />
              <LocationField control={form.control} />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Salary</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 30000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Salary</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-start">
                <Button type="submit" className="bg-red-800 hover:bg-red-900">Search Candidates</Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          {candidates.length === 0 ? (
            <p className="text-gray-500">No candidates found matching your criteria.</p>
          ) : (
            candidates.map((candidate) => (
              <Card key={candidate.id}>
                <CardHeader>
                  <CardTitle>{candidate.job_title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><span className="font-semibold">Experience:</span> {candidate.years_experience} years</p>
                    <p><span className="font-semibold">Location:</span> {candidate.location}</p>
                    <p><span className="font-semibold">Salary Range:</span> £{candidate.min_salary.toLocaleString()} - £{candidate.max_salary.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}