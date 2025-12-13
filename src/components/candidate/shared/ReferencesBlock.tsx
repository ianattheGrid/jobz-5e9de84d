import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, UserCheck } from "lucide-react";
import { ReferenceEntry } from "@/integrations/supabase/types/profiles";

const CHAR_LIMITS = {
  ref_snippet: 200,
};

interface ReferencesBlockProps {
  references: ReferenceEntry[];
  onChange: (references: ReferenceEntry[]) => void;
}

export function ReferencesBlock({ references, onChange }: ReferencesBlockProps) {
  const addReference = () => {
    const newRef: ReferenceEntry = {
      id: crypto.randomUUID(),
      ref_name: '',
      ref_relationship: '',
      ref_contact: '',
      ref_snippet: null,
    };
    onChange([...references, newRef]);
  };

  const updateReference = (id: string, field: keyof ReferenceEntry, value: string | null) => {
    onChange(references.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeReference = (id: string) => {
    onChange(references.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">📝</span> References (Optional)
        </h4>
        <p className="text-sm text-muted-foreground">
          If someone you've worked with is happy to vouch for you, you can add their details here
        </p>
      </div>

      {references.map((ref, index) => (
        <Card key={ref.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                Reference #{index + 1}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeReference(ref.id)}
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
                  value={ref.ref_name}
                  onChange={(e) => updateReference(ref.id, 'ref_name', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Relationship</label>
                <Input
                  placeholder="e.g., Store Manager, Team Leader"
                  value={ref.ref_relationship}
                  onChange={(e) => updateReference(ref.id, 'ref_relationship', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Contact (email or phone)</label>
              <Input
                placeholder="e.g., sarah.johnson@company.com or 07xxx xxxxxx"
                value={ref.ref_contact}
                onChange={(e) => updateReference(ref.id, 'ref_contact', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Only shared when you apply to a job
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                What would they say about you? (optional)
              </label>
              <Textarea
                placeholder="e.g., 'Always reliable and willing to help out...' or 'Great with customers...'"
                value={ref.ref_snippet || ''}
                onChange={(e) => updateReference(ref.id, 'ref_snippet', e.target.value.slice(0, CHAR_LIMITS.ref_snippet) || null)}
                maxLength={CHAR_LIMITS.ref_snippet}
                className="mt-1 resize-none"
                rows={2}
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {(ref.ref_snippet || '').length}/{CHAR_LIMITS.ref_snippet}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addReference}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Reference
      </Button>
    </div>
  );
}
