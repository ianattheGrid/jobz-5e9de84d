import { searchFormSchema } from "@/components/candidate-search/searchFormSchema";
import { supabase } from "@/integrations/supabase/client";
import type { z } from "zod";
import { useSalaryFilter } from "./search/useSalaryFilter";
import { useSignupDateFilter } from "./search/useSignupDateFilter";
import { useSearchState } from "./search/useSearchState";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import {
  CandidateSearchCriteria,
  explainCandidateMatch,
  MatchExplanation,
} from "@/components/candidate-search/searchCriteria";

export const useCandidateSearch = () => {
  const { buildSalaryQuery } = useSalaryFilter();
  const { buildSignupDateQuery } = useSignupDateFilter();
  const { candidates, handleSearchError, handleSearchSuccess } = useSearchState();
  const { user } = useAuth();
  const [employerCompany, setEmployerCompany] = useState<string | null>(null);
  const [criteria, setCriteria] = useState<CandidateSearchCriteria | null>(null);
  const [explanations, setExplanations] = useState<Record<string, MatchExplanation>>({});
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (user) {
      const getEmployerCompany = async () => {
        const { data } = await supabase
          .from('employer_profiles')
          .select('company_name')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          setEmployerCompany(data.company_name);
        }
      };

      getEmployerCompany();
    }
  }, [user]);

  /**
   * Core search. Hard filters run in the database; softer criteria (title
   * similarity, skills, location) are scored client-side so near-misses still
   * surface, ranked by match strength with an explanation attached.
   */
  const searchByCriteria = async (searchCriteria: CandidateSearchCriteria) => {
    setSearching(true);
    setCriteria(searchCriteria);

    try {
      let query = supabase.from('candidate_profiles').select('*');

      if (searchCriteria.minSalary != null && searchCriteria.maxSalary != null) {
        query = buildSalaryQuery(query, searchCriteria.minSalary, searchCriteria.maxSalary);
      }

      if (searchCriteria.commissionOnly) {
        query = query.not('commission_percentage', 'is', null);
      }

      if (searchCriteria.securityClearance) {
        query = query.eq('security_clearance', searchCriteria.securityClearance);
      }

      if (searchCriteria.workArea) {
        query = query.eq('workArea', searchCriteria.workArea);
      }

      if (searchCriteria.signupPeriod) {
        query = buildSignupDateQuery(query, searchCriteria.signupPeriod);
      }

      if (employerCompany) {
        query = query.not('current_employer', 'ilike', `%${employerCompany}%`);
      }

      const { data: candidateProfiles, error } = await query;

      if (error) throw error;

      const validCandidateProfiles = (candidateProfiles || []).map(profileData => ({
        ...profileData,
        location: profileData.location || [],
        required_qualifications: profileData.required_qualifications || [],
        required_skills: profileData.required_skills || null,
        years_in_current_title: profileData.years_in_current_title || null,
        title_experience: null,
        workArea: (profileData as any).workArea || null,
        itSpecialization: (profileData as any).itSpecialization || null,
      }));

      const scored = validCandidateProfiles.map(profile => ({
        profile,
        explanation: explainCandidateMatch(profile, searchCriteria),
      }));

      // Drop obvious non-matches only when the recruiter gave us something to match on.
      const hasSoftCriteria = Boolean(
        searchCriteria.jobTitle ||
        searchCriteria.skills?.length ||
        searchCriteria.location ||
        searchCriteria.minYearsExperience != null ||
        searchCriteria.qualification
      );

      const filtered = hasSoftCriteria
        ? scored.filter(s => s.explanation.score >= 25)
        : scored;

      filtered.sort((a, b) => b.explanation.score - a.explanation.score);

      const explanationMap: Record<string, MatchExplanation> = {};
      filtered.forEach(({ profile, explanation }) => {
        explanationMap[profile.id] = explanation;
      });

      setExplanations(explanationMap);
      handleSearchSuccess(filtered.map(s => s.profile) as any);
    } catch (error: any) {
      console.error('Candidate search failed:', error);
      handleSearchError();
    } finally {
      setSearching(false);
    }
  };

  /** Classic filter-form entry point — maps form values onto the shared criteria. */
  const searchCandidates = async (values: z.infer<typeof searchFormSchema>) => {
    const [minSalary, maxSalary] = (values.salary || "").split(" - ").map(s =>
      parseInt(s.replace(/[£,]/g, ""))
    );

    await searchByCriteria({
      workArea: values.workArea || undefined,
      itSpecialization: values.itSpecialization || undefined,
      jobTitle: values.title || undefined,
      minSalary: Number.isFinite(minSalary) ? minSalary : undefined,
      maxSalary: Number.isFinite(maxSalary) ? maxSalary : undefined,
      skills: values.required_skills?.length ? values.required_skills : undefined,
      qualification: values.requiresQualification ? values.qualificationRequired || undefined : undefined,
      securityClearance: values.requiresSecurityClearance ? values.securityClearanceLevel || undefined : undefined,
      signupPeriod: values.signupPeriod || undefined,
      commissionOnly: values.includeCommissionCandidates || undefined,
    });
  };

  return { candidates, searchCandidates, searchByCriteria, criteria, explanations, searching };
};
