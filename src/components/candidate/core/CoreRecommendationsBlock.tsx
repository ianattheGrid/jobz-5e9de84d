import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Quote } from "lucide-react";
import { CoreReferenceEntry } from "@/integrations/supabase/types/profiles";
import { CORE_CHAR_LIMITS } from "./constants";

interface CoreRecommendationsBlockProps {
  recommendations: CoreReferenceEntry[];
  onChange: (recommendations: CoreReferenceEntry[]) => void;
}

export function CoreRecommendationsBlock({ recommendations, onChange }: CoreRecommendationsBlockProps) {
  const addRecommendation = () => {
    const newRec: CoreReferenceEntry = {
      id: crypto.randomUUID(),
      ref_name: '',
      ref_role_title: '',
      ref_relationship: '',
      ref_contact: null,
      ref_snippet: null,
    };
    onChange([...recommendations, newRec]);
  };

  const updateRecommendation = (id: string, field: keyof CoreReferenceEntry, value: string | null) => {
    onChange(recommendations.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRecommendation = (id: string) => {
    onChange(recommendations.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">💬</span> Recommendations / Testimonials (Optional)
        </h4>
        <p className="text-sm text-muted-foreground">
          If someone you've worked with is happy to vouch for you, you can add a short quote or their details here
        </p>
      </div>

      {recommendations.map((rec, index) => (
        <Card key={rec.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Quote className="h-4 w-4 text-muted-foreground" />
                Recommendation #{index + 1}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeRecommendation(rec.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Name</label>
                <Input
                  placeholder="e.g., Sarah Johnson"
                  value={rec.ref_name}
                  onChange={(e) => updateRecommendation(rec.id, 'ref_name', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Their role title</label>
                <Input
                  placeholder="e.g., Regional Manager"
                  value={rec.ref_role_title}
                  onChange={(e) => updateRecommendation(rec.id, 'ref_role_title', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Relationship to you</label>
                <Input
                  placeholder="e.g., Former Line Manager"
                  value={rec.ref_relationship}
                  onChange={(e) => updateRecommendation(rec.id, 'ref_relationship', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Contact (optional)</label>
                <Input
                  placeholder="e.g., sarah.johnson@company.com"
                  value={rec.ref_contact || ''}
                  onChange={(e) => updateRecommendation(rec.id, 'ref_contact', e.target.value || null)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only shared when you apply to a job
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Quote / What would they say about you?
              </label>
              <Textarea
                placeholder='e.g., "John consistently stabilised under-performing teams and left each one stronger than he found it."'
                value={rec.ref_snippet || ''}
                onChange={(e) => updateRecommendation(rec.id, 'ref_snippet', e.target.value.slice(0, CORE_CHAR_LIMITS.ref_snippet) || null)}
                maxLength={CORE_CHAR_LIMITS.ref_snippet}
                className="mt-1 resize-none"
                rows={3}
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {(rec.ref_snippet || '').length}/{CORE_CHAR_LIMITS.ref_snippet}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addRecommendation}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Recommendation
      </Button>
    </div>
  );
}
