import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, Loader2 } from "lucide-react";
import type { VacancyFormValues } from "./VacancyFormSchema";

/**
 * Describe the role in a sentence and the assistant fills in the form below.
 * Nothing is posted — the employer still checks and submits it themselves.
 */
export function VacancyBriefAssistant({ form }: { form: UseFormReturn<VacancyFormValues> }) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const draft = async () => {
    if (prompt.trim().length < 10) {
      toast({
        variant: "destructive",
        title: "Tell us a bit more",
        description: "Describe the role in a sentence or two and we'll fill in the form.",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("parse-vacancy-brief", {
        body: { prompt },
      });

      let message = "";
      if (error) {
        try {
          message = JSON.parse(await (error as any).context?.text?.())?.error ?? "";
        } catch (_e) {
          message = "";
        }
      }
      if (error || data?.error) {
        toast({
          variant: "destructive",
          title: "Couldn't draft that",
          description: message || data?.error || "Please try again, or fill in the form yourself below.",
        });
        return;
      }

      const d = data?.draft ?? {};
      const set = (field: keyof VacancyFormValues, value: unknown) => {
        if (value === undefined || value === null || value === "") return;
        form.setValue(field as any, value as any, { shouldValidate: false, shouldDirty: true });
      };

      set("title", d.title);
      set("location", d.location);
      set("description", d.description);
      set("workArea", d.workArea);
      set("itSpecialization", d.itSpecialization);
      set("specialization", d.itSpecialization);
      set("min_salary", d.min_salary);
      set("max_salary", d.max_salary);
      set("minYearsExperience", d.minYearsExperience);
      set("holidayEntitlement", d.holidayEntitlement);
      set("companyBenefits", d.companyBenefits);
      set("workLocation", d.workLocation);

      toast({
        title: "Draft ready below",
        description: "Check every field and change anything that isn't right before you post.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Describe the job instead of filling the form
        </CardTitle>
        <CardDescription>
          Write a sentence or two about the role. We'll fill in the form below for you to check and edit —
          nothing is posted until you press Post Vacancy. We only use what you write, we never make details up.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. We need a 1st line IT support person in Bristol, £26,000 to £30,000, hybrid, at least a year's experience, 25 days holiday."
        />
        <Button type="button" onClick={draft} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Drafting..." : "Draft my vacancy"}
        </Button>
      </CardContent>
    </Card>
  );
}
