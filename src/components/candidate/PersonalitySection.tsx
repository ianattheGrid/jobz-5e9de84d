import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Check, Info, Sparkles } from "lucide-react";

export type PersonalityItem = {
  question_key: string;
  question_label: string;
  answer: string;
};

const CHAR_LIMIT = 100;
const MAX_ITEMS = 8;

const PROMPTS: { key: string; label: string }[] = [
  { key: "best_holiday", label: "Best holiday I've taken" },
  { key: "favorite_book", label: "Favorite book" },
  { key: "best_concert", label: "Best concert I've been to" },
  { key: "day_maker", label: "A small thing that makes my day" },
  { key: "proud_challenge", label: "A challenge I'm proud I solved" },
  { key: "last_cry", label: "When I last cried (and why it mattered)" },
  { key: "learn_new", label: "My go-to way to learn something new" },
  { key: "fav_tool", label: "The tool I can't live without at work" },
  { key: "core_value", label: "A value I won't compromise on" },
  { key: "hobby", label: "A hobby I love" },
  { key: "best_advice", label: "The best advice I've received" },
  { key: "teammates_expect", label: "What teammates can expect from me" },
  { key: "morning_ritual", label: "My perfect morning starts with" },
  { key: "proudest_moment", label: "My proudest professional moment" },
  { key: "weekend_activity", label: "How I like to spend my weekends" },
  { key: "learning_moment", label: "A time I learned something important" },
  { key: "dream_project", label: "A dream project I'd love to work on" },
  { key: "inspiration", label: "What motivates me every day" },
  { key: "fun_fact", label: "A fun fact about me" },
  { key: "problem_solving", label: "How I approach difficult problems" },
  { key: "team_contribution", label: "How I contribute to team success" },
  { key: "work_environment", label: "My ideal work environment" },
  { key: "career_highlight", label: "A career milestone I'm proud of" },
  { key: "personal_growth", label: "Something I'm working to improve" },
  { key: "life_philosophy", label: "A belief that guides my decisions" },
];

interface PersonalitySectionProps {
  userId: string;
  initialItems?: PersonalityItem[] | null;
  onSaved?: (items: PersonalityItem[]) => void;
}

export function PersonalitySection({ userId, initialItems, onSaved }: PersonalitySectionProps) {
  const { toast } = useToast();
  const [selected, setSelected] = useState<PersonalityItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialItems && Array.isArray(initialItems)) {
      setSelected(
        initialItems
          .filter((i) => i && typeof i.answer === "string" && i.answer.trim().length > 0)
          .slice(0, MAX_ITEMS)
      );
    }
  }, [initialItems]);

  const availablePrompts = useMemo(() => {
    const chosen = new Set(selected.map((s) => s.question_key));
    return PROMPTS.map((p) => ({ ...p, chosen: chosen.has(p.key) }));
  }, [selected]);

  const onTogglePrompt = (key: string, label: string) => {
    const exists = selected.find((s) => s.question_key === key);
    if (exists) {
      setSelected((prev) => prev.filter((s) => s.question_key !== key));
      return;
    }
    if (selected.length >= MAX_ITEMS) {
      toast({
        variant: "destructive",
        title: "Limit reached",
        description: `You can add up to ${MAX_ITEMS} answers.`,
      });
      return;
    }
    setSelected((prev) => [...prev, { question_key: key, question_label: label, answer: "" }]);
  };

  const onChangeAnswer = (key: string, value: string) => {
    setSelected((prev) =>
      prev.map((s) =>
        s.question_key === key
          ? { ...s, answer: value.slice(0, CHAR_LIMIT) }
          : s
      )
    );
  };

  const onSave = async () => {
    try {
      setSaving(true);
      const clean = selected
        .map((s) => ({
          question_key: s.question_key,
          question_label: s.question_label,
          answer: (s.answer || "").trim(),
        }))
        .filter((s) => s.answer.length > 0)
        .slice(0, MAX_ITEMS);

      const { error } = await supabase
        .from("candidate_profiles")
        .update({ personality: clean })
        .eq("id", userId);

      if (error) throw error;

      toast({ title: "Saved", description: "Your personality answers were updated." });
      onSaved?.(clean);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Could not save answers." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Personality</h2>
            <p className="text-sm text-gray-600 mt-1">Pick up to {MAX_ITEMS}. Keep it human and short (max {CHAR_LIMIT} characters each).</p>
          </div>
          <Badge className="bg-pink-100 text-pink-800">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Icebreakers
          </Badge>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {availablePrompts.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => onTogglePrompt(p.key, p.label)}
              className={`flex items-center justify-between rounded-md border px-3 py-2 text-left transition hover:bg-gray-50 ${
                p.chosen ? "border-pink-300 bg-pink-50" : "border-gray-200 bg-white"
              }`}
            >
              <span className="text-sm text-gray-800">{p.label}</span>
              {p.chosen && <Check className="w-4 h-4 text-pink-600" />}
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="mt-6 space-y-4">
            {selected.map((item) => (
              <div key={item.question_key} className="rounded-md border border-gray-200 p-4 bg-white">
                <Label className="text-sm text-gray-800">{item.question_label}</Label>
                <Textarea
                  value={item.answer}
                  onChange={(e) => onChangeAnswer(item.question_key, e.target.value)}
                  className="mt-2 min-h-[72px]"
                  maxLength={CHAR_LIMIT}
                  placeholder="Write a short, human answer…"
                />
                <div className="mt-1 text-right text-xs text-gray-500">{item.answer.length}/{CHAR_LIMIT}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-600">
            <Info className="w-3.5 h-3.5 mr-1" /> Employers see these as friendly icebreakers on your public profile.
          </div>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}