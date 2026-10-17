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

type Radar = "off" | "quiet" | "active";

const RADAR_OPTIONS: { value: Radar; label: string; body: string }[] = [
  { value: "off", label: "Off", body: "Invisible. No employer sees you, even as a match." },
  { value: "quiet", label: "Quiet radar", body: "Only exceptional fits (85%+) that match your pay and location." },
  { value: "active", label: "Actively looking", body: "Shown to verified employers whenever you fit a live vacancy." },
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
  const [radar, setRadar] = useState<Radar>("off");
  const [visible, setVisible] = useState<Record<string, boolean>>(DEFAULT_VISIBILITY);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("candidate_profiles")
        .select("board_enabled, board_visible_fields, radar_status")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        const on = Boolean((data as any).board_enabled);
        setEnabled(on);
        setRadar(on ? (((data as any).radar_status as Radar) || "quiet") : "off");
        setVisible({ ...DEFAULT_VISIBILITY, ...(((data as any).board_visible_fields || {}) as Record<string, boolean>) });
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const save = async (next: { enabled?: boolean; radar?: Radar; visible?: Record<string, boolean> }) => {
    if (!user) return;
    setSaving(true);
    const payload: any = {};
    if (next.enabled !== undefined) payload.board_enabled = next.enabled;
    if (next.radar && next.radar !== "off") payload.radar_status = next.radar;
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
        <div className="space-y-3">
          <p className="text-sm font-medium">My radar</p>
          <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="My radar">
            {RADAR_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={radar === o.value}
                disabled={saving}
                onClick={() => {
                  setRadar(o.value);
                  setEnabled(o.value !== "off");
                  save({ enabled: o.value !== "off", radar: o.value });
                }}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  radar === o.value ? "border-primary bg-primary/10" : "border-border hover:bg-muted/50"
                }`}
              >
                <p className="font-medium text-foreground">{o.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{o.body}</p>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            No public badge, ever. You only appear against real vacancies, your name and employer stay hidden,
            and your current company can never see you.
          </p>
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
