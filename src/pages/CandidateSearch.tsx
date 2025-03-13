import { useEffect } from "react";
import { useEmployerAuthCheck } from "@/hooks/useEmployerAuthCheck";
import { useCandidateSearch } from "@/hooks/useCandidateSearch";
import { SearchForm } from "@/components/candidate-search/SearchForm";
import { SearchResults } from "@/components/candidate-search/SearchResults";
import { LoadingState } from "@/components/candidate-search/LoadingState";
import { Header } from "@/components/candidate-search/Header";
import { SavedSearches } from "@/components/candidate-search/SavedSearches";

export default function CandidateSearch() {
  const { loading, checkUser } = useEmployerAuthCheck();
  const { candidates, searchCandidates } = useCandidateSearch();

  useEffect(() => {
    checkUser();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Header />

        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <SavedSearches />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Search Filters</h2>
              <p className="text-sm text-gray-600 mt-1">
                Use the filters below to narrow down your candidate search.
              </p>
            </div>
            <SearchForm onSubmit={searchCandidates} />
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
