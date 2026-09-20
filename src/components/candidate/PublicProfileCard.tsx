import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, ExternalLink, Linkedin, Share2 } from "lucide-react";

const AVAILABILITY_OPTIONS = [
  { value: "actively_looking", label: "Actively looking" },
  { value: "open_to_offers", label: "Open to the right offer" },
  { value: "not_looking", label: "Not looking right now" },
];

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

export const PublicProfileCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [availability, setAvailability] = useState("open_to_offers");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("candidate_profiles")
        .select("full_name, public_profile_enabled, public_profile_slug, availability_status")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setFullName(data.full_name || "");
        setEnabled(Boolean(data.public_profile_enabled));
        setSlug(data.public_profile_slug);
        setAvailability(data.availability_status || "open_to_offers");
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const publicUrl = slug ? `${window.location.origin}/p/${slug}` : "";

  const save = async (updates: {
    public_profile_enabled?: boolean;
    public_profile_slug?: string;
    availability_status?: string;
  }) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("candidate_profiles")
      .update(updates)
      .eq("id", user.id);
    setSaving(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Couldn't save that",
        description: error.message,
      });
      return false;
    }
    return true;
  };

  const handleToggle = async (next: boolean) => {
    let nextSlug = slug;

    if (next && !nextSlug) {
      const base = slugify(fullName || "candidate") || "candidate";
      nextSlug = `${base}-${Math.random().toString(36).slice(2, 7)}`;
    }

    const ok = await save({
      public_profile_enabled: next,
      ...(nextSlug && nextSlug !== slug ? { public_profile_slug: nextSlug } : {}),
    });

    if (ok) {
      setEnabled(next);
      if (nextSlug) setSlug(nextSlug);
      toast({
        title: next ? "Your shareable page is live" : "Your shareable page is off",
        description: next
          ? "Anyone with the link can see your headline details — never your email, phone or address."
          : "The link no longer works.",
      });
    }
  };

  const handleAvailability = async (value: string) => {
    const ok = await save({ availability_status: value });
    if (ok) {
      setAvailability(value);
      toast({ title: "Saved", description: "Employers will see your new status." });
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast({ title: "Link copied", description: "Paste it anywhere you like." });
    } catch {
      toast({
        variant: "destructive",
        title: "Couldn't copy",
        description: publicUrl,
      });
    }
  };

  if (loading) return null;

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" /> Your shareable profile link
        </CardTitle>
        <CardDescription>
          One clean page you can put in your LinkedIn bio, send in a message, or add to your CV —
          so employers can find you without you applying anywhere.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="public-profile">Turn my shareable page on</Label>
            <p className="text-sm text-gray-600 mt-1">
              Shows your name, role, experience, salary range and skills. Never your email, phone
              number or address.
            </p>
          </div>
          <Switch
            id="public-profile"
            checked={enabled}
            disabled={saving}
            onCheckedChange={handleToggle}
          />
        </div>

        {enabled && slug && (
          <div className="space-y-3">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm break-all text-gray-800">
              {publicUrl}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copyLink} className="gap-2">
                <Copy className="h-4 w-4" /> Copy link
              </Button>
              <Button variant="outline" size="sm" asChild className="gap-2">
                <a href={publicUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" /> Preview
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild className="gap-2">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin className="h-4 w-4" /> Share on LinkedIn
                </a>
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>How actively are you looking?</Label>
          <Select value={availability} onValueChange={handleAvailability} disabled={saving}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABILITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-600">
            Employers searching for people see this, so they know whether it's worth getting in
            touch. Your current employer can't see it.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
