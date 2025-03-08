import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Job = Database['public']['Tables']['jobs']['Row'];

export default function ManageJobs() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [jobToDelete, setJobToDelete] = useState<number | null>(null);

  const { data: jobs, isLoading, error, refetch } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Job[];
    }
  });

  const handleDelete = async (jobId: number) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete job",
      });
    }
    setJobToDelete(null);
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-red-500">
        Error loading jobs: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/employer/dashboard" className="text-primary hover:text-primary/90">
              Employer Dashboard
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-white">Manage Jobs</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Manage Jobs</h1>
        <Button 
          onClick={() => navigate('/employer/create-vacancy')}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Post New Job
        </Button>
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Salary Range</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>£{job.salary_min.toLocaleString()} - £{job.salary_max.toLocaleString()}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/employer/edit-job/${job.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setJobToDelete(job.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Job</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this job posting? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setJobToDelete(null)}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => jobToDelete && handleDelete(jobToDelete)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          You haven't posted any jobs yet.
        </div>
      )}
    </div>
  );
}
