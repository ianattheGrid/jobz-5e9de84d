import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Job {
  id: number;
  title: string;
  company: string;
  soft_launch_only: boolean;
  created_at: string;
}

export const JobVisibilityManager = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, company, soft_launch_only, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const toggleVisibility = async (jobId: number, currentValue: boolean) => {
    setUpdating(jobId);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ soft_launch_only: !currentValue })
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Visibility Updated",
        description: !currentValue 
          ? "Job is now soft launch only" 
          : "Job is now publicly visible",
      });

      fetchJobs();
    } catch (error: any) {
      console.error('Error updating job:', error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Visibility Control</CardTitle>
        <CardDescription>
          Manage which jobs are visible during soft launch vs. live mode
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No jobs found
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>
                      <Badge variant={job.soft_launch_only ? "secondary" : "default"}>
                        {job.soft_launch_only ? (
                          <><EyeOff className="h-3 w-3 mr-1" /> Soft Launch Only</>
                        ) : (
                          <><Eye className="h-3 w-3 mr-1" /> Publicly Visible</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(job.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleVisibility(job.id, job.soft_launch_only)}
                        disabled={updating === job.id}
                      >
                        {updating === job.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : job.soft_launch_only ? (
                          "Make Public"
                        ) : (
                          "Soft Launch Only"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Visibility Rules:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• <strong>Soft Launch Only:</strong> Job visible only during soft launch period</li>
            <li>• <strong>Publicly Visible:</strong> Job visible in all modes (soft launch and live)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
