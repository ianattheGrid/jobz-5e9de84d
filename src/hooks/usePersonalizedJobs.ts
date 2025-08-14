import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Job } from "@/integrations/supabase/types/jobs";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { useMatchScore } from "@/components/job-card/hooks/useMatchScore";
import { calculateJobTitleMatchScore } from "@/utils/jobTitleMatching";

interface JobWithScore extends Job {
  matchScore?: number;
}

export const usePersonalizedJobs = () => {
  const [jobs, setJobs] = useState<JobWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPersonalizedJobs = async () => {
      try {
        setLoading(true);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch candidate profile
        const { data: candidateProfile, error: profileError } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        if (!candidateProfile) {
          setLoading(false);
          return;
        }

        setProfile(candidateProfile);

        // Fetch all available jobs
        const { data: allJobs, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (jobsError) {
          console.error('Error fetching jobs:', jobsError);
          throw jobsError;
        }

        if (!allJobs || allJobs.length === 0) {
          setJobs([]);
          setLoading(false);
          return;
        }

        // Calculate match scores for each job
        const jobsWithScores: JobWithScore[] = [];
        
        for (const job of allJobs) {
          try {
            // Calculate basic match criteria
            let matchScore = 0;
            let totalCriteria = 0;

            // Enhanced Title/Work Area match (30% weight)
            if (candidateProfile.job_title && job.work_area) {
              totalCriteria += 30;
              const titleMatchScore = calculateJobTitleMatchScore(
                candidateProfile.job_title,
                job.work_area,
                job.specialization
              );
              matchScore += titleMatchScore * 30;
            }

            // Location match (20% weight)
            if (candidateProfile.location && candidateProfile.location.length > 0 && job.location) {
              totalCriteria += 20;
              const candidateLocations = candidateProfile.location.map(loc => loc.toLowerCase());
              if (candidateLocations.some(loc => job.location.toLowerCase().includes(loc))) {
                matchScore += 20;
              }
            }

            // Salary match (25% weight)
            if (candidateProfile.min_salary && candidateProfile.max_salary && 
                job.salary_min && job.salary_max) {
              totalCriteria += 25;
              // Check if there's any overlap in salary ranges
              if (!(candidateProfile.max_salary < job.salary_min || 
                    candidateProfile.min_salary > job.salary_max)) {
                matchScore += 25;
              }
            }

            // Skills match (25% weight)
            if (candidateProfile.required_skills && candidateProfile.required_skills.length > 0 &&
                job.required_skills && job.required_skills.length > 0) {
              totalCriteria += 25;
              const candidateSkills = candidateProfile.required_skills.map(s => s.toLowerCase());
              const jobSkills = job.required_skills.map(s => s.toLowerCase());
              const matchingSkills = candidateSkills.filter(skill => 
                jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
              );
              const skillMatchPercentage = matchingSkills.length / Math.max(candidateSkills.length, jobSkills.length);
              matchScore += skillMatchPercentage * 25;
            }

            // Calculate final percentage
            const finalScore = totalCriteria > 0 ? Math.round((matchScore / totalCriteria) * 100) : 0;

            // Only include jobs with at least 40% match
            if (finalScore >= 40) {
              jobsWithScores.push({
                ...job,
                matchScore: finalScore
              });
            }
          } catch (error) {
            console.error('Error calculating match score for job:', job.id, error);
          }
        }

        // Sort by match score and take top 6
        const sortedJobs = jobsWithScores
          .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
          .slice(0, 6);

        setJobs(sortedJobs);

      } catch (error) {
        console.error('Error fetching personalized jobs:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load personalized job recommendations.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalizedJobs();
  }, [toast]);

  return { jobs, loading, profile };
};