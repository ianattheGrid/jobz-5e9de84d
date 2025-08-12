import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Info, Sparkles, Plus } from "lucide-react";

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
  { key: "proud_challenge", label: "A personal challenge I overcame" },
  { key: "last_cry", label: "When I last cried (and why it mattered)" },
  { key: "hobby", label: "A hobby I love" },
  { key: "best_advice", label: "The best advice I've received" },
  { key: "morning_ritual", label: "My perfect morning starts with" },
  { key: "weekend_activity", label: "How I like to spend my weekends" },
  { key: "learning_moment", label: "A time I learned something important about myself" },
  { key: "fun_fact", label: "A fun fact about me" },
  { key: "childhood_memory", label: "A favorite childhood memory" },
  { key: "sports_achievement", label: "A sports or fitness achievement I'm proud of" },
  { key: "volunteer_experience", label: "A volunteering experience that meant something to me" },
  { key: "travel_story", label: "A travel story that changed me" },
  { key: "family_tradition", label: "A family tradition I cherish" },
  { key: "creative_project", label: "A creative project I've enjoyed" },
  { key: "friendship_story", label: "What friendship means to me" },
  { key: "fear_conquered", label: "A fear I've conquered" },
  { key: "guilty_pleasure", label: "My guilty pleasure" },
  { key: "life_lesson", label: "An important life lesson I've learned" },
  { key: "personality_quirk", label: "A quirky thing about my personality" },
  { key: "inspiration_person", label: "Someone who inspires me and why" },
  { key: "bucket_list", label: "Something on my bucket list" },
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

        <div className="mt-4">
          <Select onValueChange={(value) => {
            const prompt = PROMPTS.find(p => p.key === value);
            if (prompt) {
              onTogglePrompt(prompt.key, prompt.label);
            }
          }}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <SelectValue placeholder="Add a personality question..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              {availablePrompts
                .filter(p => !p.chosen)
                .map((p) => (
                  <SelectItem key={p.key} value={p.key}>
                    {p.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          
          {selected.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.map((item) => (
                <button
                  key={item.question_key}
                  type="button"
                  onClick={() => onTogglePrompt(item.question_key, item.question_label)}
                  className="flex items-center gap-2 rounded-full border border-pink-300 bg-pink-50 px-3 py-1 text-sm text-pink-800 hover:bg-pink-100 transition"
                >
                  <span>{item.question_label}</span>
                  <Check className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
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