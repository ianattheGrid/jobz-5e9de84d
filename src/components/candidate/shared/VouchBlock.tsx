import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, UserCheck } from "lucide-react";
import { CoreReferenceEntry } from "@/integrations/supabase/types/profiles";

interface VouchBlockProps {
  recommendations: CoreReferenceEntry[];
  onChange: (recommendations: CoreReferenceEntry[]) => void;
}

/**
 * "Who can vouch for me": a tick plus name, company, position and job title.
 * No quotes and no contact details — an employer who wants to check can ring
 * the person at their workplace.
 */
export function VouchBlock({ recommendations, onChange }: VouchBlockProps) {
  const add = () =>
    onChange([
      ...recommendations,
      {
        id: crypto.randomUUID(),
        ref_name: "",
        ref_company: "",
        ref_role_title: "",
        ref_relationship: "",
        ref_will_vouch: true,
      },
    ]);

  const update = (id: string, patch: Partial<CoreReferenceEntry>) =>
    onChange(recommendations.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const remove = (id: string) => onChange(recommendations.filter((r) => r.id !== id));

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" /> Who can vouch for me (optional)
        </h4>
        <p className="text-sm text-muted-foreground">
          Just tick and add who they are. No quotes, no contact details — only shown after you agree to share
          your details with an employer.
        </p>
      </div>

      {recommendations.map((rec) => (
        <Card key={rec.id}>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={rec.ref_will_vouch !== false}
                  onCheckedChange={(v) => update(rec.id, { ref_will_vouch: v === true })}
                />
                <span className="text-sm font-medium text-foreground">This person is happy to vouch for me</span>
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove"
                onClick={() => remove(rec.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Name" placeholder="e.g. Sarah Johnson" value={rec.ref_name}
                onChange={(v) => update(rec.id, { ref_name: v })} />
              <Field label="Company" placeholder="e.g. Severn Networks" value={rec.ref_company || ""}
                onChange={(v) => update(rec.id, { ref_company: v })} />
              <Field label="Position (to you)" placeholder="e.g. Former line manager" value={rec.ref_relationship}
                onChange={(v) => update(rec.id, { ref_relationship: v })} />
              <Field label="Job title" placeholder="e.g. Head of IT" value={rec.ref_role_title}
                onChange={(v) => update(rec.id, { ref_role_title: v })} />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={add} className="w-full gap-2">
        <Plus className="h-4 w-4" /> Add someone who can vouch for me
      </Button>
    </div>
  );
}

const Field = ({ label, placeholder, value, onChange }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
}) => (
  <div>
    <label className="text-sm font-medium text-foreground">{label}</label>
    <Input className="mt-1" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);
