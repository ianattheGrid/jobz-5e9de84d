import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  CandidateSearchCriteria,
  describeCriteria,
} from "./searchCriteria";

interface NaturalLanguageSearchProps {
  onSearch: (criteria: CandidateSearchCriteria) => Promise<void>;
  criteria: CandidateSearchCriteria | null;
  searching: boolean;
}

const EXAMPLES = [
  "Senior React developer in Bristol, hybrid, up to £70k",
  "1st line IT support, 2+ years, happy with £28k",
  "Finance analyst with SQL, joined in the last month",
];

export function NaturalLanguageSearch({ onSearch, criteria, searching }: NaturalLanguageSearchProps) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [parsing, setParsing] = useState(false);

  const runSearch = async (text: string) => {
    if (text.trim().length < 3) {
      toast({
        title: "Tell us a bit more",
        description: "Describe the person you're looking for, e.g. \"Frontend developer in Bristol under £60k\".",
        variant: "destructive",
      });
      return;
    }

    setParsing(true);
    try {
      const { data, error } = await supabase.functions.invoke("parse-candidate-search", {
        body: { prompt: text },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const parsed = (data?.criteria || {}) as CandidateSearchCriteria;

      if (Object.keys(parsed).length === 0) {
        toast({
          title: "Couldn't read that search",
          description: "Try mentioning a job title, location or salary.",
          variant: "destructive",
        });
        return;
      }

      await onSearch(parsed);
    } catch (err: any) {
      toast({
        title: "Search failed",
        description: err.message || "We couldn't run that search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setParsing(false);
    }
  };

  const removeChip = async (key: string) => {
    if (!criteria) return;
    const next: CandidateSearchCriteria = { ...criteria };
    const map: Record<string, (keyof CandidateSearchCriteria)[]> = {
      Title: ["jobTitle"],
      Area: ["workArea"],
      Specialism: ["itSpecialization"],
      Location: ["location"],
      Salary: ["minSalary", "maxSalary"],
      Experience: ["minYearsExperience"],
      Skills: ["skills"],
      "Work style": ["workPreference"],
      Clearance: ["securityClearance"],
      Qualification: ["qualification"],
      Bonus: ["commissionOnly"],
    };
    (map[key] || []).forEach(field => delete next[field]);
    await onSearch(next);
  };

  const chips = criteria ? describeCriteria(criteria) : [];
  const busy = parsing || searching;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Smart search</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Describe who you're looking for in plain English — we'll turn it into filters and explain every match.
      </p>

      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            runSearch(prompt);
          }
        }}
        placeholder="e.g. Experienced 2nd line support engineer near Bristol, up to £35k, available now"
        rows={2}
        className="resize-none"
      />

      <div className="flex flex-wrap gap-2 mt-3">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setPrompt(example);
              runSearch(example);
            }}
            className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors"
          >
            {example}
          </button>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={() => runSearch(prompt)} disabled={busy} className="gap-2">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {busy ? "Searching..." : "Search with AI"}
        </Button>
      </div>

      {chips.length > 0 && (
        <div className="mt-5 pt-4 border-t">
          <p className="text-sm font-medium text-gray-900 mb-2">Filters we understood:</p>
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <Badge key={chip.label} variant="secondary" className="gap-1 py-1 pl-3 pr-2">
                <span className="text-gray-500">{chip.label}:</span> {chip.value}
                <button
                  type="button"
                  aria-label={`Remove ${chip.label} filter`}
                  onClick={() => removeChip(chip.label)}
                  className="ml-1 rounded-full hover:bg-gray-300/60 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
