import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Skill {
  id: string;
  skill_name: string;
  work_area: string;
  specialization?: string;
}

export interface SkillSuggestion {
  id: string;
  skill_name: string;
  work_area: string;
  specialization?: string;
  suggested_by: string;
  ai_validation_status: string;
  ai_validation_score?: number;
  ai_validation_reason?: string;
  admin_status: string;
  admin_notes?: string;
  admin_reviewed_by?: string;
  admin_reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export const useSkills = (workArea?: string, specialization?: string) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [suggestions, setSuggestions] = useState<SkillSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    try {
      let query = supabase.from('master_skills').select('*');
      
      if (workArea) {
        query = query.eq('work_area', workArea);
      }
      
      if (specialization) {
        query = query.eq('specialization', specialization);
      }

      const { data, error } = await query.order('skill_name');

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to load skills');
    }
  };

  const fetchUserSuggestions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('skill_suggestions')
        .select('*')
        .eq('suggested_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const suggestSkill = async (skillName: string, workArea: string, specialization?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to suggest skills');
        return;
      }

      // Check if skill already exists
      const { data: existingSkill } = await supabase
        .from('master_skills')
        .select('*')
        .eq('skill_name', skillName)
        .eq('work_area', workArea)
        .eq('specialization', specialization || '')
        .single();

      if (existingSkill) {
        toast.error('This skill already exists');
        return;
      }

      // Check if suggestion already exists
      const { data: existingSuggestion } = await supabase
        .from('skill_suggestions')
        .select('*')
        .eq('skill_name', skillName)
        .eq('work_area', workArea)
        .eq('specialization', specialization || '')
        .eq('suggested_by', user.id)
        .single();

      if (existingSuggestion) {
        toast.error('You have already suggested this skill');
        return;
      }

      // Insert the suggestion
      const { data, error } = await supabase
        .from('skill_suggestions')
        .insert({
          skill_name: skillName,
          work_area: workArea,
          specialization: specialization || null,
          suggested_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger AI validation
      try {
        await supabase.functions.invoke('validate-skill', {
          body: {
            skillName,
            workArea,
            specialization,
            suggestionId: data.id
          }
        });
      } catch (validationError) {
        console.error('AI validation failed:', validationError);
        // Don't fail the suggestion if AI validation fails
      }

      toast.success('Skill suggestion submitted for review');
      fetchUserSuggestions();
    } catch (error) {
      console.error('Error suggesting skill:', error);
      toast.error('Failed to submit skill suggestion');
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchSkills(), fetchUserSuggestions()]).finally(() => {
      setLoading(false);
    });
  }, [workArea, specialization]);

  return {
    skills,
    suggestions,
    loading,
    suggestSkill,
    refetch: () => {
      fetchSkills();
      fetchUserSuggestions();
    }
  };
};