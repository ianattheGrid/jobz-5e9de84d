
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/integrations/supabase/types/jobs";
import { useAuth } from "@/hooks/useAuth";
import NavBar from "@/components/NavBar";
import LoadingSpinner from "@/components/jobs/LoadingSpinner";
import EmptyJobsList from "@/components/jobs/EmptyJobsList";
import JobList from "@/components/jobs/JobList";
import JobsHeader from "@/components/jobs/JobsHeader";
import JobSearch from "@/components/jobs/JobSearch";
import { useState } from "react";
import { JobSearchSchema } from "@/components/jobs/JobSearchSchema";
import { bristolPostcodes } from "@/data/bristolPostcodes";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import ExternalJobCard from "@/components/jobs/ExternalJobCard";
import { FoundAdvert } from "@/utils/externalJobs";

const Jobs = () => {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState<JobSearchSchema | null>(null);

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', searchFilters],
    queryFn: async () => {
      console.log('Fetching jobs...', { userType, userId: user?.id, searchFilters });
      
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      // /jobs is the public job board — show all jobs regardless of user type.
      // Employer-scoped listings live at /employer/manage-jobs.

      if (searchFilters) {
        if (searchFilters.workArea) {
          query = query.eq('work_area', searchFilters.workArea);
        }

        if (searchFilters.specialization) {
          query = query.eq('specialization', searchFilters.specialization);
        }

        if (searchFilters.title) {
          query = query.ilike('title', `%${searchFilters.title}%`);
        }

        if (searchFilters.location && searchFilters.location.length > 0) {
          if (searchFilters.location.length === bristolPostcodes.length) {
            // If all locations are selected, don't filter by location
          } else {
            query = query.in('location', searchFilters.location);
          }
        }

        if (searchFilters.hasCommission) {
          query = query.not('candidate_commission', 'is', null).gt('candidate_commission', 0);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }

      console.log('Jobs data received:', data?.length || 0);
      
      if (!data || data.length === 0) {
        return [];
      }
      
      const transformedData: Job[] = data.map(job => ({
        ...job as Omit<Job, 'match_threshold' | 'required_skills'>,
        match_threshold: (job as any).match_threshold || 60,
        required_skills: (job as any).required_skills || []
      }));
      
      return transformedData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });

  // Adverts we found on companies' own careers pages. Shown quietly alongside
  // Jobz vacancies — we link out to the company, we don't take applications.
  const { data: foundAdverts } = useQuery({
    queryKey: ['external-jobs', searchFilters?.title, searchFilters?.location],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_found_adverts', {
        _limit: 30,
        _search: searchFilters?.title || null,
      });
      if (error) throw error;
      return (data || []).map((row: any) => ({
        id: row.id,
        job_title: row.job_title,
        location: row.location,
        job_url: row.job_url,
        salary_min: row.salary_min,
        salary_max: row.salary_max,
        target_companies: { company_name: row.company_name, website: row.company_website },
      })) as FoundAdvert[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleSearch = (filters: JobSearchSchema) => {
    console.log('Applying search filters:', filters);
    setSearchFilters(filters);
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8 px-4 bg-background min-h-screen demo-employer-dark">
        <div className="mb-6">
          <JobsHeader userType={userType} />
        </div>
        
        <JobSearch onSearch={handleSearch} userType={userType} />
        
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500 mt-8">
            <p>Failed to load jobs. Please try again later.</p>
            <p className="text-sm mt-2">{(error as Error)?.message || 'Unknown error'}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <EmptyJobsList userType={userType} />
        ) : (
          <JobList jobs={jobs} />
        )}

        {!!foundAdverts?.length && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-white">Also hiring in Bristol</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-2xl">
              These roles are advertised on the companies' own sites. We link you straight to
              them — no middleman, nothing added on top.
            </p>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {foundAdverts.map((advert) => (
                <ExternalJobCard key={advert.id} job={advert} candidateId={user?.id ?? null} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Jobs;
