import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const FIELDS: { key: string; label: string }[] = [
  { key: "full_name", label: "My name" },
  { key: "email", label: "My email address" },
  { key: "phone_number", label: "My phone number" },
  { key: "current_employer", label: "Who I work for now" },
  { key: "linkedin_url", label: "My LinkedIn" },
  { key: "cv_url", label: "My CV" },
  { key: "profile_picture_url", label: "My photo" },
];

const DEFAULT_VISIBILITY = FIELDS.reduce(
  (acc, f) => ({ ...acc, [f.key]: false }),
  {} as Record<string, boolean>
);

/**
 * Candidate control panel: whether they appear in employer match results at
 * all, and which details are visible without being asked. Everything is off
 * unless the person turns it on.
 */
export const BoardVisibilityCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState<Record<string, boolean>>(DEFAULT_VISIBILITY);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("candidate_profiles")
        .select("board_enabled, board_visible_fields")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setEnabled(Boolean((data as any).board_enabled));
        setVisible({ ...DEFAULT_VISIBILITY, ...(((data as any).board_visible_fields || {}) as Record<string, boolean>) });
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const save = async (next: { enabled?: boolean; visible?: Record<string, boolean> }) => {
    if (!user) return;
    setSaving(true);
    const payload: any = {};
    if (next.enabled !== undefined) payload.board_enabled = next.enabled;
    if (next.visible) payload.board_visible_fields = next.visible;

    const { error } = await supabase.from("candidate_profiles").update(payload).eq("id", user.id);
    setSaving(false);

    if (error) {
      toast({ variant: "destructive", title: "Could not save", description: error.message });
      return;
    }
    toast({ title: "Saved", description: "Your visibility settings are up to date." });
  };

  if (loading) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Who can find me</CardTitle>
        <CardDescription>
          You decide whether employers see you at all, and what they see before you say yes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Label htmlFor="board-enabled" className="font-medium">
              Show me in employer match results
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              You appear only against real vacancies you fit — never in a list anyone can browse.
              Your name, contact details and current employer stay hidden.
            </p>
          </div>
          <Switch
            id="board-enabled"
            checked={enabled}
            disabled={saving}
            onCheckedChange={(v) => {
              setEnabled(v);
              save({ enabled: v });
            }}
          />
        </div>

        <div className="space-y-3 border-t pt-4">
          <p className="text-sm font-medium">Details I'm happy to show straight away</p>
          <p className="text-sm text-muted-foreground">
            Leave these off and employers have to ask you first. You can change your mind any time.
          </p>
          {FIELDS.map((f) => (
            <div key={f.key} className="flex items-center justify-between gap-4">
              <Label htmlFor={`vis-${f.key}`} className="font-normal">
                {f.label}
              </Label>
              <Switch
                id={`vis-${f.key}`}
                checked={Boolean(visible[f.key])}
                disabled={!enabled || saving}
                onCheckedChange={(v) => setVisible((prev) => ({ ...prev, [f.key]: v }))}
              />
            </div>
          ))}
          <Button disabled={!enabled || saving} onClick={() => save({ visible })}>
            Save what's visible
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
