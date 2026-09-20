
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SavedSearch {
  id: string;
  work_area: string | null;
  specialization: string | null;
  min_salary: number | null;
  max_salary: number | null;
  required_skills: string[] | null;
  required_qualifications: string[] | null;
  match_threshold: number;
  is_active: boolean;
  alert_frequency: string;
  last_alert_sent_at: string | null;
}

export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadSavedSearches = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('employer_searches')
      .select('*')
      .eq('employer_id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load saved searches",
        variant: "destructive",
      });
      return;
    }

    setSavedSearches(data || []);
  };

  const setAlertFrequency = async (searchId: string, frequency: 'off' | 'daily') => {
    const { error } = await supabase
      .from('employer_searches')
      .update({ alert_frequency: frequency })
      .eq('id', searchId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update your email alerts",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: frequency === 'daily' ? "Daily emails on" : "Daily emails off",
      description: frequency === 'daily'
        ? "We'll email you when new people match this search."
        : "You won't get emails for this search any more.",
    });

    loadSavedSearches();
  };

  const saveSearch = async (searchData: Omit<SavedSearch, 'id' | 'is_active' | 'alert_frequency' | 'last_alert_sent_at'>) => {
    if (!user) return;

    const { error } = await supabase
      .from('employer_searches')
      .insert({
        ...searchData,
        employer_id: user.id,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save search",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Search criteria saved successfully",
    });
    
    loadSavedSearches();
  };

  const updateMatchThreshold = async (searchId: string, threshold: number) => {
    const { error } = await supabase
      .from('employer_searches')
      .update({ match_threshold: threshold })
      .eq('id', searchId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update match threshold",
        variant: "destructive",
      });
      return;
    }

    loadSavedSearches();
  };

  const toggleSearchActive = async (searchId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('employer_searches')
      .update({ is_active: isActive })
      .eq('id', searchId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update search status",
        variant: "destructive",
      });
      return;
    }

    loadSavedSearches();
  };

  useEffect(() => {
    loadSavedSearches();
  }, [user]);

  return {
    savedSearches,
    saveSearch,
    updateMatchThreshold,
    toggleSearchActive,
    setAlertFrequency,
  };
};
