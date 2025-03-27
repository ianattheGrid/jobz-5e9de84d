
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Briefcase, MapPin, CircleDollarSign, Hash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface EmployerJobsListProps {
  employerId: string;
}

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
  salary_min: number;
  salary_max: number;
  created_at: string;
  candidate_commission: number | null;
  required_skills: string[];
  reference_code: string;
}

export const EmployerJobsList = ({ employerId }: EmployerJobsListProps) => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('employer_id', employerId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          setJobs(data);
        }
      } catch (error) {
        console.error('Error fetching employer jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [employerId]);
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (jobs.length === 0) {
    return (
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No open positions</h3>
            <p className="mt-1 text-sm text-gray-500">
              This company doesn't have any open positions at the moment.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Current Openings ({jobs.length})</h3>
          
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 bg-white">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">{job.title}</h4>
                    {job.reference_code && (
                      <div className="flex items-center mt-1 text-primary">
                        <Hash className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Ref: {job.reference_code}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <CircleDollarSign className="h-4 w-4 text-gray-400" />
                        £{job.salary_min.toLocaleString()} - £{job.salary_max.toLocaleString()}
                      </div>
                      <Badge variant="outline" className="border-pink-500 text-pink-500">
                        {job.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <Link to={`/jobs`} state={{ selectedJob: job.id }}>
                    <Button size="sm" className="whitespace-nowrap bg-primary hover:bg-primary/90 text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
                
                <Separator className="my-3" />
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {job.description}
                </p>
                
                {job.required_skills && job.required_skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.required_skills.slice(0, 5).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
                        {skill}
                      </Badge>
                    ))}
                    {job.required_skills.length > 5 && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        +{job.required_skills.length - 5} more
                      </Badge>
                    )}
                  </div>
                )}
                
                {job.candidate_commission !== null && (
                  <div className="mt-3">
                    <Badge className="bg-green-100 text-green-800">
                      You're Hired Bonus Available
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
