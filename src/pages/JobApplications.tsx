import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, ArrowLeft, User, Mail, Phone } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function JobApplications() {
  const { jobId } = useParams<{ jobId: string }>();

  const { data: jobData, isLoading: jobLoading } = useQuery({
    queryKey: ['job-details', jobId],
    queryFn: async () => {
      if (!jobId) throw new Error('Job ID is required');
      
      const { data, error } = await supabase
        .from('jobs')
        .select('title, company')
        .eq('id', parseInt(jobId))
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!jobId,
  });

  const { data: applications, isLoading } = useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: async () => {
      if (!jobId) throw new Error('Job ID is required');
      
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          candidate_profiles(
            full_name,
            email,
            phone_number,
            job_title,
            years_experience
          )
        `)
        .eq('job_id', parseInt(jobId))
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!jobId,
  });

  if (jobLoading || isLoading) {
    return <div className="container mx-auto py-8">Loading applications...</div>;
  }

  if (!jobData) {
    return (
      <div className="container mx-auto py-8 text-red-500">
        Job not found or you don't have permission to view applications.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Link to="/employer/manage-jobs">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Manage Jobs
          </Button>
        </Link>
        
        <Link to="/employer/dashboard">
          <Button className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>

      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/employer/dashboard" className="text-primary hover:text-primary/90">
              Employer Dashboard
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link to="/employer/manage-jobs" className="text-primary hover:text-primary/90">
              Manage Jobs
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-white">Applications</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Applications for {jobData.title}
        </h1>
        <p className="text-gray-600">{jobData.company}</p>
        <div className="mt-4">
          <Badge variant="secondary">
            {applications?.length || 0} total applications
          </Badge>
        </div>
      </div>

      {applications && applications.length > 0 ? (
        <div className="grid gap-6">
          {applications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Application #{application.id}
                    </h3>
                    <p className="text-gray-600">
                      Status: {application.status || 'Pending'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Applied {new Date(application.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Badge variant={
                    application.employer_accepted === true ? 'default' :
                    application.employer_accepted === false ? 'destructive' :
                    'secondary'
                  }>
                    {application.employer_accepted === true ? 'Accepted' :
                     application.employer_accepted === false ? 'Rejected' :
                     'Pending'}
                  </Badge>
                  <p className="text-xs text-gray-500">
                    Applied {new Date(application.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Applicant ID: {application.applicant_id}</span>
                </div>
                
                {application.resume_url && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>Resume attached</span>
                  </div>
                )}
              </div>

              {application.cover_letter && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                    {application.cover_letter}
                  </p>
                </div>
              )}

              {application.match_percentage && (
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Match Score:</span>
                    <Badge variant="outline">
                      {application.match_percentage}%
                    </Badge>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button size="sm" variant="outline">
                  View Full Profile
                </Button>
                <Button size="sm" variant="outline">
                  Schedule Interview
                </Button>
                {application.employer_accepted === null && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Accept
                    </Button>
                    <Button size="sm" variant="destructive">
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No applications received yet.</p>
          <p className="text-gray-400 text-sm mt-2">
            Applications will appear here when candidates apply to this job.
          </p>
        </div>
      )}
    </div>
  );
}