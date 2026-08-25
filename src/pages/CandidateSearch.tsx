import { useEffect } from "react";
import { useEmployerAuthCheck } from "@/hooks/useEmployerAuthCheck";
import { useCandidateSearch } from "@/hooks/useCandidateSearch";
import { SearchForm } from "@/components/candidate-search/SearchForm";
import { SearchResults } from "@/components/candidate-search/SearchResults";
import { LoadingState } from "@/components/candidate-search/LoadingState";
import { Header } from "@/components/candidate-search/Header";
import { SavedSearches } from "@/components/candidate-search/SavedSearches";
import { NaturalLanguageSearch } from "@/components/candidate-search/NaturalLanguageSearch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  if (loading) {
    return <LoadingState />;
  }

  return <div className="min-h-screen bg-white">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Header />

        <div className="flex flex-col gap-8">
          <SavedSearches />

          <NaturalLanguageSearch
            onSearch={searchByCriteria}
            criteria={criteria}
            searching={searching}
          />

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <Accordion type="single" collapsible>
              <AccordionItem value="filters" className="border-none">
                <AccordionTrigger className="hover:no-underline py-0">
                  <div className="text-left">
                    <h2 className="text-xl font-semibold text-gray-900">Search Filters</h2>
                    <p className="text-sm text-gray-600 mt-1 font-normal">
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

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
              <p className="text-sm text-gray-600 mt-1">
                Ranked by how well each candidate fits, with the reasoning shown.
              </p>
            </div>
            <SearchResults candidates={candidates} explanations={explanations} />
          </div>
        </div>
      </div>
    </div>;
}
