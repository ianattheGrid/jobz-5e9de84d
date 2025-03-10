
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

const Jobs = () => {
  const { user, userType } = useAuth();
  const [searchFilters, setSearchFilters] = useState<JobSearchSchema | null>(null);

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', searchFilters],
    queryFn: async () => {
      console.log('Fetching jobs...', { userType, userId: user?.id, searchFilters });
      
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (user && userType === 'employer') {
        query = query.eq('employer_id', user.id);
      }

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
          } else {
            query = query.in('location', searchFilters.location);
          }
        }

        if (searchFilters.hasCommission) {
          query = query.not('candidate_commission', 'is', null);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [
          {
            id: 1,
            title: 'Senior Software Engineer',
            company: 'Tech Solutions Ltd',
            location: 'BS3',
            description: 'Lead development of our core platform...',
            type: 'Full-time',
            salary_min: 60000,
            salary_max: 85000,
            holiday_entitlement: 25,
            company_benefits: 'Health, Dental, Pension',
            created_at: new Date().toISOString(),
            candidate_commission: null,
            employer_id: null,
            required_qualifications: null,
            title_essential: false,
            years_experience_essential: false,
            min_years_experience: null,
            salary_essential: false,
            skills_essential: false,
            qualification_essential: false,
            citizenship_essential: false,
            required_citizenship: null,
            work_area: 'Technology',
            specialization: 'Software Development'
          },
          {
            id: 2,
            title: 'Product Manager',
            company: 'Innovation Hub',
            location: 'BS6',
            description: 'Drive product strategy and execution...',
            type: 'Full-time',
            salary_min: 55000,
            salary_max: 75000,
            holiday_entitlement: 28,
            company_benefits: 'Health, Gym, Car',
            created_at: new Date().toISOString(),
            candidate_commission: null,
            employer_id: null,
            required_qualifications: null,
            title_essential: false,
            years_experience_essential: false,
            min_years_experience: null,
            salary_essential: false,
            skills_essential: false,
            qualification_essential: false,
            citizenship_essential: false,
            required_citizenship: null,
            work_area: 'Product',
            specialization: 'Product Management'
          },
          {
            id: 3,
            title: 'UX Designer',
            company: 'Creative Studios',
            location: 'BS8',
            description: 'Create beautiful user experiences...',
            type: 'Full-time',
            salary_min: 45000,
            salary_max: 65000,
            holiday_entitlement: 25,
            company_benefits: 'Health, Wellness',
            created_at: new Date().toISOString(),
            candidate_commission: null,
            employer_id: null,
            required_qualifications: null,
            title_essential: false,
            years_experience_essential: false,
            min_years_experience: null,
            salary_essential: false,
            skills_essential: false,
            qualification_essential: false,
            citizenship_essential: false,
            required_citizenship: null,
            work_area: 'Design',
            specialization: 'UX/UI Design'
          }
        ] as Job[];
      }
      
      return data as Job[];
    }
  });

  const handleSearch = (filters: JobSearchSchema) => {
    console.log('Applying search filters:', filters);
    setSearchFilters(filters);
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8 px-4 bg-background min-h-screen">
        <JobsHeader userType={userType} jobCount={jobs?.length || 0} />
        <JobSearch onSearch={handleSearch} />
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500">
            Failed to load jobs. Please try again later.
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <EmptyJobsList userType={userType} />
        ) : (
          <JobList jobs={jobs} />
        )}
      </div>
    </>
  );
};

export default Jobs;
