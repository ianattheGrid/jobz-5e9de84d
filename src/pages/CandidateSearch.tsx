import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/candidate-search/SearchForm";
import { SearchResults } from "@/components/candidate-search/SearchResults";
import { searchFormSchema } from "@/components/candidate-search/searchFormSchema";
import { LayoutDashboard } from "lucide-react";
import type { z } from "zod";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";

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

  const getSignupDateFilter = (period: string) => {
    const now = new Date();
    switch (period) {
      case "24h":
        return new Date(now.setHours(now.getHours() - 24));
      case "48h":
        return new Date(now.setHours(now.getHours() - 48));
      case "1w":
        return new Date(now.setDate(now.getDate() - 7));
      case "2w":
        return new Date(now.setDate(now.getDate() - 14));
      case "4w":
        return new Date(now.setDate(now.getDate() - 28));
      case "3m":
        return new Date(now.setMonth(now.getMonth() - 3));
      case "6m+":
        return new Date(now.setMonth(now.getMonth() - 6));
      default:
        return null;
    }
  };

  const onSubmit = async (values: z.infer<typeof searchFormSchema>) => {
    try {
      const [minSalary, maxSalary] = values.salary.split(" - ").map(s => 
        parseInt(s.replace(/[£,]/g, ""))
      );

      let query = supabase
        .from('candidate_profiles')
        .select('*');

      if (values.location) {
        query = query.ilike('location', `%${values.location}%`);
      }

      const flexibleMinSalary = minSalary - 5000;
      const flexibleMaxSalary = maxSalary + 5000;
      
      query = query
        .or(`min_salary.lte.${flexibleMaxSalary},max_salary.gte.${flexibleMinSalary}`);

      if (values.includeCommissionCandidates) {
        query = query.not('commission_percentage', 'is', null);
      }

      if (values.qualification && values.qualification !== 'None') {
        query = query.contains('required_qualifications', [values.qualification]);
      }

      if (values.required_skills && values.required_skills.length > 0) {
        query = query.contains('required_skills', values.required_skills);
      }

      if (values.requiresSecurityClearance && values.securityClearanceLevel) {
        query = query.eq('security_clearance', values.securityClearanceLevel);
      }

      if (values.workEligibility) {
        query = query.eq('work_eligibility', values.workEligibility);
      }

      if (values.signupPeriod) {
        const signupDate = getSignupDateFilter(values.signupPeriod);
        if (signupDate) {
          if (values.signupPeriod === "6m+") {
            query = query.lte('signup_date', signupDate.toISOString());
          } else {
            query = query.gte('signup_date', signupDate.toISOString());
          }
        }
      }

      const { data: candidateProfiles, error } = await query;

      if (error) throw error;

      const validCandidateProfiles = candidateProfiles.map(profileData => ({
        id: profileData.id,
        email: profileData.email,
        job_title: profileData.job_title,
        years_experience: profileData.years_experience,
        location: profileData.location || [],
        min_salary: profileData.min_salary,
        max_salary: profileData.max_salary,
        required_qualifications: profileData.required_qualifications || [],
        required_skills: profileData.required_skills || null,
        security_clearance: profileData.security_clearance,
        commission_percentage: profileData.commission_percentage,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at,
        signup_date: profileData.signup_date,
        work_eligibility: profileData.work_eligibility,
        preferred_work_type: profileData.preferred_work_type,
        availability: profileData.availability,
        additional_skills: profileData.additional_skills,
        address: profileData.address,
        ai_synopsis: profileData.ai_synopsis,
        ai_synopsis_last_updated: profileData.ai_synopsis_last_updated,
        ai_synopsis_status: profileData.ai_synopsis_status,
        current_employer: profileData.current_employer,
        cv_url: profileData.cv_url,
        full_name: profileData.full_name,
        phone_number: profileData.phone_number,
        profile_picture_url: profileData.profile_picture_url,
        travel_radius: profileData.travel_radius,
        work_preferences: profileData.work_preferences,
        desired_job_title: profileData.desired_job_title,
        home_postcode: profileData.home_postcode,
        linkedin_url: profileData.linkedin_url,
        years_in_current_title: profileData.years_in_current_title || null
      }));

      setCandidates(validCandidateProfiles);
      toast({
        title: "Search Completed",
        description: `Found ${validCandidateProfiles.length} matching candidates.`,
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
    return (
      <div className="min-h-screen bg-[#121212]">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-32">
            <p className="text-white">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <Link to="/employer/dashboard">
            <Button 
              variant="default"
              className="bg-primary hover:bg-primary/90 text-white gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-bold text-primary [&]:!text-primary">Search Candidates</h1>
            <p className="mt-2 text-neutral-200">
              Find the perfect candidates for your roles by using our advanced search filters.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Search Filters</h2>
              <p className="text-sm text-gray-600 mt-1">
                Use the filters below to narrow down your candidate search.
              </p>
            </div>
            <SearchForm onSubmit={onSubmit} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
              <p className="text-sm text-gray-600 mt-1">
                View and filter through matching candidates.
              </p>
            </div>
            <SearchResults candidates={candidates} />
          </div>
        </div>
      </div>
    </div>
  );
}
