import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

/** Lets a candidate turn the weekly "roles that fit you" email on or off. */
export const EmailPreferencesCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("candidate_profiles")
        .select("weekly_job_email")
        .eq("id", user.id)
        .maybeSingle();
      if (data) setEnabled(data.weekly_job_email ?? true);
      setLoading(false);
    };
    load();
  }, [user]);

  const toggle = async (value: boolean) => {
    if (!user) return;
    setEnabled(value);
    const { error } = await supabase
      .from("candidate_profiles")
      .update({ weekly_job_email: value })
      .eq("id", user.id);

    if (error) {
      setEnabled(!value);
      toast({
        variant: "destructive",
        title: "Couldn't save that",
        description: "Please try again in a moment.",
      });
      return;
    }

    toast({
      title: value ? "Weekly emails on" : "Weekly emails off",
      description: value
        ? "Every Monday we'll send you the roles that fit you."
        : "You won't get the weekly roles email any more.",
    });
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Emails from Jobz</CardTitle>
        <CardDescription>Choose what lands in your inbox</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium text-gray-900">Weekly roles that fit you</p>
            <p className="text-sm text-gray-600">
              A short Monday email with new jobs matching what you're after. Nothing else.
            </p>
          </div>
          <Switch checked={enabled} disabled={loading} onCheckedChange={toggle} />
        </div>
      </CardContent>
    </Card>
  );
};
