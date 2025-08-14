import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface JobTitle {
  id: string;
  job_title: string;
  work_area: string;
}

export interface JobTitleSuggestion {
  id: string;
  job_title: string;
  work_area: string;
  suggested_by: string;
  created_at: string;
  ai_validation_status: 'pending' | 'approved' | 'rejected';
  ai_validation_score?: number;
  ai_validation_reason?: string;
  admin_review_status?: 'pending' | 'approved' | 'rejected';
  admin_review_notes?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_status?: string;
  admin_notes?: string;
  admin_reviewed_at?: string;
  admin_reviewed_by?: string;
}

export const useJobTitles = (workArea?: string, specialization?: string) => {
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [suggestions, setSuggestions] = useState<JobTitleSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchJobTitles = async () => {
    try {
      let query = supabase
        .from('master_job_titles')
        .select('*')
        .order('job_title');

      if (workArea) {
        query = query.eq('work_area', workArea);
      }

      if (specialization) {
        query = query.eq('specialization', specialization);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching job titles:', error);
        toast({
          title: "Error",
          description: "Failed to fetch job titles",
          variant: "destructive",
        });
        return;
      }

      setJobTitles(data || []);
    } catch (error) {
      console.error('Error fetching job titles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch job titles",
        variant: "destructive",
      });
    }
  };

  const fetchUserSuggestions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('job_title_suggestions')
        .select('*')
        .eq('suggested_by', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching job title suggestions:', error);
        return;
      }

      setSuggestions((data || []) as JobTitleSuggestion[]);
    } catch (error) {
      console.error('Error fetching job title suggestions:', error);
    }
  };

  const suggestJobTitle = async (jobTitle: string, workArea: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to suggest job titles",
          variant: "destructive",
        });
        return false;
      }

      // Check if job title already exists
      const { data: existingJobTitle } = await supabase
        .from('master_job_titles')
        .select('id')
        .eq('job_title', jobTitle)
        .eq('work_area', workArea)
        .single();

      if (existingJobTitle) {
        toast({
          title: "Job title exists",
          description: "This job title already exists in our database",
          variant: "destructive",
        });
        return false;
      }

      // Check if suggestion already exists
      const { data: existingSuggestion } = await supabase
        .from('job_title_suggestions')
        .select('id')
        .eq('job_title', jobTitle)
        .eq('work_area', workArea)
        .single();

      if (existingSuggestion) {
        toast({
          title: "Suggestion exists",
          description: "This job title has already been suggested",
          variant: "destructive",
        });
        return false;
      }

      // Insert new suggestion
      const { data, error } = await supabase
        .from('job_title_suggestions')
        .insert({
          job_title: jobTitle,
          work_area: workArea,
          suggested_by: user.id,
          ai_validation_status: 'pending',
          admin_review_status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating job title suggestion:', error);
        toast({
          title: "Error",
          description: "Failed to submit job title suggestion",
          variant: "destructive",
        });
        return false;
      }

      // Trigger AI validation
      try {
        await supabase.functions.invoke('validate-job-title', {
          body: {
            jobTitle,
            workArea,
            suggestionId: data.id
          }
        });
      } catch (validationError) {
        console.error('Error triggering AI validation:', validationError);
        // Don't show error to user as the suggestion was still created
      }

      toast({
        title: "Success",
        description: "Job title suggestion submitted for review",
      });

      // Refresh suggestions
      await fetchUserSuggestions();
      return true;
    } catch (error) {
      console.error('Error suggesting job title:', error);
      toast({
        title: "Error",
        description: "Failed to submit job title suggestion",
        variant: "destructive",
      });
      return false;
    }
  };

  const refetch = async () => {
    setLoading(true);
    await Promise.all([fetchJobTitles(), fetchUserSuggestions()]);
    setLoading(false);
  };

  useEffect(() => {
    refetch();
  }, [workArea, specialization]);

  return {
    jobTitles,
    suggestions,
    loading,
    suggestJobTitle,
    refetch
  };
};