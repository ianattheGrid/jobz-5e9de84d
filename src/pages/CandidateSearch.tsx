import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEmployerAuthCheck } from "@/hooks/useEmployerAuthCheck";
import { useCandidateSearch } from "@/hooks/useCandidateSearch";
import { SearchForm } from "@/components/candidate-search/SearchForm";
import { SearchResults } from "@/components/candidate-search/SearchResults";
import { LoadingState } from "@/components/candidate-search/LoadingState";
import { Header } from "@/components/candidate-search/Header";
import { SavedSearches } from "@/components/candidate-search/SavedSearches";
import { NaturalLanguageSearch } from "@/components/candidate-search/NaturalLanguageSearch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import NavBar from "@/components/NavBar";

export default function CandidateSearch() {
  const {
    loading,
    checkUser
  } = useEmployerAuthCheck();
  const {
    candidates,
    searchCandidates,
    searchByCriteria,
    criteria,
    explanations,
    searching
  } = useCandidateSearch();

  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [jobTitleSearched, setJobTitleSearched] = useState<string | null>(null);
  const prefilledFor = useRef<string | null>(null);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  // "Find people for this role" — build the search straight from the vacancy.
  useEffect(() => {
    if (!jobId || prefilledFor.current === jobId) return;
    prefilledFor.current = jobId;

    const searchFromJob = async () => {
      const { data: job } = await supabase
        .from("jobs")
        .select("title, location, salary_min, salary_max, work_area, specialization, required_skills, min_years_experience")
        .eq("id", Number(jobId))
        .maybeSingle();

      if (!job) return;

      setJobTitleSearched(job.title);
      await searchByCriteria({
        jobTitle: job.title || undefined,
        location: job.location || undefined,
        minSalary: job.salary_min ?? undefined,
        maxSalary: job.salary_max ?? undefined,
        workArea: job.work_area || undefined,
        itSpecialization: job.specialization && job.specialization !== "Other" ? job.specialization : undefined,
        skills: job.required_skills?.length ? job.required_skills : undefined,
        minYearsExperience: job.min_years_experience ?? undefined,
      });
    };

    searchFromJob();
  }, [jobId, searchByCriteria]);


  if (loading) {
    return <LoadingState />;
  }

  return <CosmicBackground mode="full">
      <NavBar />
      <div className="container max-w-7xl mx-auto px-4 pt-24 pb-12 relative z-10">
        <Header />

        <div className="flex flex-col gap-8">
          {jobTitleSearched && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm text-white/80">
                Showing people who fit your vacancy <strong>{jobTitleSearched}</strong>. Change
                anything below to widen or narrow the search.
              </p>
            </div>
          )}

          <SavedSearches />

          <NaturalLanguageSearch
            onSearch={searchByCriteria}
            criteria={criteria}
            searching={searching}
          />

          <div className="cosmic-form rounded-lg p-6 bg-black/40 backdrop-blur-xl border border-primary/30">
            <Accordion type="single" collapsible>
              <AccordionItem value="filters" className="border-none">
                <AccordionTrigger className="hover:no-underline py-0">
                  <div className="text-left">
                    <h2 className="text-xl font-semibold text-white">Search Filters</h2>
                    <p className="text-sm text-white/70 mt-1 font-normal">
                      Prefer to pick filters yourself? Open the classic search.
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6">
                  <SearchForm onSubmit={searchCandidates} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="rounded-lg p-6 bg-black/30 backdrop-blur-xl border border-primary/20">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Search Results</h2>
              <p className="text-sm text-white/70 mt-1">
                Ranked by how well each candidate fits, with the reasoning shown.
              </p>
            </div>
            <SearchResults candidates={candidates} explanations={explanations} />
          </div>
        </div>
      </div>
    </CosmicBackground>;
}
