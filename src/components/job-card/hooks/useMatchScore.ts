import { useState, useEffect } from "react";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { calculateSkillsMatchScore } from "../utils/skillsMatching";
import { calculateTitleSimilarity } from "../utils/titleMatching";
import { supabase } from "@/integrations/supabase/client";

export const useMatchScore = (profile: CandidateProfile, job: any) => {
  const titleMatch = () => {
    // Fuzzy + synonym-aware title comparison.
    // See src/components/job-card/utils/titleMatching.ts to edit synonym groups.
    return calculateTitleSimilarity(profile.job_title as any, job.title);
  };


  const specializationMatch = () => {
    if (!profile.job_title || !job.specialization) return 0;
    
    // Handle job_title as either string or array
    const profileTitles = Array.isArray(profile.job_title) 
      ? profile.job_title.map(title => title.toLowerCase()) 
      : [profile.job_title.toLowerCase()];
    
    const spec = job.specialization.toLowerCase();
    
    // Check if any title includes the specialization
    if (profileTitles.some(title => title.includes(spec))) return 1;
    if (profileTitles.some(title => spec.includes(title))) return 0.8;
    
    return 0;
  };

  const locationMatch = () => {
    if (!profile.location || !job.location) return 0;
    return profile.location.some(loc => 
      loc.toLowerCase() === job.location.toLowerCase()
    ) ? 1 : 0;
  };

  const experienceMatch = () => {
    if (profile.years_experience === undefined || job.min_years_experience === undefined) return 0;
    
    const yearsDiff = profile.years_experience - job.min_years_experience;
    if (yearsDiff >= 0) return 1;
    if (yearsDiff >= -2) return 0.8; // Close to required experience
    if (yearsDiff >= -3) return 0.5; // Somewhat close
    return 0;
  };

  const salaryMatch = () => {
    if (!profile.min_salary || !profile.max_salary || !job.salary_min || !job.salary_max) return 0;

    const profileRange = profile.max_salary - profile.min_salary;
    const jobRange = job.salary_max - job.salary_min;
    
    const overlapStart = Math.max(profile.min_salary, job.salary_min);
    const overlapEnd = Math.min(profile.max_salary, job.salary_max);
    const overlapAmount = Math.max(0, overlapEnd - overlapStart);
    
    const profileCenter = (profile.max_salary + profile.min_salary) / 2;
    const jobCenter = (job.salary_max + job.salary_min) / 2;
    
    const centerDistance = Math.abs(profileCenter - jobCenter);
    const maxPossibleDistance = Math.max(profileRange, jobRange);
    const centerScore = 1 - (centerDistance / maxPossibleDistance);
    
    return (overlapAmount > 0) 
      ? (0.7 * (overlapAmount / Math.min(profileRange, jobRange))) + (0.3 * centerScore)
      : 0.3 * centerScore;
  };

  const checkVerificationStatus = async () => {
    try {
      const { data } = await supabase
        .from('candidate_verifications')
        .select('verification_status')
        .eq('candidate_id', profile.id)
        .maybeSingle();
      
      return data?.verification_status === 'verified';
    } catch (error) {
      console.error('Error checking verification status:', error);
      return false;
    }
  };

  const calculateTotalScore = async () => {
    let totalScore = 0;
    totalScore += titleMatch() * 0.35;          // Job title match (35%)
    totalScore += locationMatch() * 0.15;       // Location match (15%)
    totalScore += experienceMatch() * 0.15;     // Experience match (15%)
    totalScore += specializationMatch() * 0.25; // Specialization match (25%)
    totalScore += salaryMatch() * 0.10;         // Salary match (10%)
    // Verification gate removed — candidates are auto-verified for scoring purposes.
    return totalScore;
  };


  return {
    titleMatch,
    specializationMatch,
    locationMatch,
    experienceMatch,
    salaryMatch,
    calculateTotalScore
  };
};
