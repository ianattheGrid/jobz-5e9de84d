import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Certification {
  id: string;
  certification_name: string;
  work_area: string;
  specialization?: string;
}

export interface CertificationSuggestion {
  id: string;
  certification_name: string;
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

export const useCertifications = (workArea?: string, specialization?: string) => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [suggestions, setSuggestions] = useState<CertificationSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertifications = async () => {
    try {
      let query = supabase.from('master_certifications').select('*');
      
      if (workArea) {
        query = query.eq('work_area', workArea);
      }
      
      if (specialization) {
        query = query.eq('specialization', specialization);
      }

      const { data, error } = await query.order('certification_name');

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      console.error('Error fetching certifications:', error);
      toast.error('Failed to load certifications');
    }
  };

  const fetchUserSuggestions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('certification_suggestions')
        .select('*')
        .eq('suggested_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching certification suggestions:', error);
    }
  };

  const suggestCertification = async (certificationName: string, workArea: string, specialization?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to suggest certifications');
        return;
      }

      // Check if certification already exists
      const { data: existingCert } = await supabase
        .from('master_certifications')
        .select('*')
        .eq('certification_name', certificationName)
        .eq('work_area', workArea)
        .eq('specialization', specialization || '')
        .single();

      if (existingCert) {
        toast.error('This certification already exists');
        return;
      }

      // Check if suggestion already exists
      const { data: existingSuggestion } = await supabase
        .from('certification_suggestions')
        .select('*')
        .eq('certification_name', certificationName)
        .eq('work_area', workArea)
        .eq('specialization', specialization || '')
        .eq('suggested_by', user.id)
        .single();

      if (existingSuggestion) {
        toast.error('You have already suggested this certification');
        return;
      }

      // Insert the suggestion
      const { data, error } = await supabase
        .from('certification_suggestions')
        .insert({
          certification_name: certificationName,
          work_area: workArea,
          specialization: specialization || null,
          suggested_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Certification suggestion submitted for review');
      fetchUserSuggestions();
    } catch (error) {
      console.error('Error suggesting certification:', error);
      toast.error('Failed to submit certification suggestion');
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCertifications(), fetchUserSuggestions()]).finally(() => {
      setLoading(false);
    });
  }, [workArea, specialization]);

  return {
    certifications,
    suggestions,
    loading,
    suggestCertification,
    refetch: () => {
      fetchCertifications();
      fetchUserSuggestions();
    }
  };
};