import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MessageSquare, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { CoreReferenceEntry } from "@/integrations/supabase/types/profiles";
import { PIVOT_CHAR_LIMITS } from "./constants";

interface PivotRecommendationsBlockProps {
  recommendations: CoreReferenceEntry[];
  onChange: (recommendations: CoreReferenceEntry[]) => void;
}

const createEmptyRecommendation = (): CoreReferenceEntry => ({
  id: crypto.randomUUID(),
  ref_name: "",
  ref_role_title: "",
  ref_relationship: "",
  ref_contact: null,
  ref_snippet: null,
});

export function PivotRecommendationsBlock({ recommendations, onChange }: PivotRecommendationsBlockProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    recommendations.length > 0 ? recommendations[0].id : null
  );

  const addRecommendation = () => {
    const newRec = createEmptyRecommendation();
    onChange([...recommendations, newRec]);
    setExpandedId(newRec.id);
  };

  const updateRecommendation = (id: string, updates: Partial<CoreReferenceEntry>) => {
    onChange(recommendations.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const removeRecommendation = (id: string) => {
    onChange(recommendations.filter(r => r.id !== id));
    if (expandedId === id) {
      setExpandedId(recommendations.find(r => r.id !== id)?.id || null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-orange-600" />
        <h4 className="text-lg font-semibold text-foreground">Who Can Vouch For Me</h4>
        <span className="text-sm text-muted-foreground">(Optional)</span>
      </div>

      <p className="text-sm text-muted-foreground">
        If someone can speak to your skills or character, you can add their details or a short quote here.
        Focus on people who can speak to your transferable skills.
      </p>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <Card key={rec.id} className="border border-border">
            <Collapsible open={expandedId === rec.id} onOpenChange={() => setExpandedId(expandedId === rec.id ? null : rec.id)}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-foreground">
                        {rec.ref_name || "New Recommendation"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {rec.ref_relationship || "Relationship"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); removeRecommendation(rec.id); }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {expandedId === rec.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Name</Label>
                      <Input
                        value={rec.ref_name}
                        onChange={(e) => updateRecommendation(rec.id, { ref_name: e.target.value })}
                        placeholder="e.g., Sarah Johnson"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Their Role/Title</Label>
                      <Input
                        value={rec.ref_role_title}
                        onChange={(e) => updateRecommendation(rec.id, { ref_role_title: e.target.value })}
                        placeholder="e.g., Head of Marketing"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Relationship</Label>
                      <Input
                        value={rec.ref_relationship}
                        onChange={(e) => updateRecommendation(rec.id, { ref_relationship: e.target.value })}
                        placeholder="e.g., Former Manager, Course Instructor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Contact (Optional)</Label>
                      <Input
                        value={rec.ref_contact || ""}
                        onChange={(e) => updateRecommendation(rec.id, { ref_contact: e.target.value || null })}
                        placeholder="Email or phone"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">
                      What would they say about you? (Optional)
                    </Label>
                    <Textarea
                      value={rec.ref_snippet || ""}
                      onChange={(e) => updateRecommendation(rec.id, { ref_snippet: e.target.value || null })}
                      placeholder="A short quote that speaks to your skills or character..."
                      className="min-h-[80px] resize-none"
                      maxLength={PIVOT_CHAR_LIMITS.ref_snippet}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {(rec.ref_snippet?.length || 0)}/{PIVOT_CHAR_LIMITS.ref_snippet}
                    </p>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addRecommendation}
        className="w-full gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Recommendation
      </Button>
    </div>
  );
}
