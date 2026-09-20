import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Send, Trash2 } from "lucide-react";

interface Prospect {
  id: string;
  company_name: string;
  company_website: string | null;
  contact_email: string | null;
  role_title: string | null;
  role_location: string | null;
  source_url: string;
  estimated_salary: number | null;
  estimated_agency_fee: number | null;
  status: string;
  sent_at: string | null;
  created_at: string;
}

interface Signup {
  id: string;
  code: string;
  new_user_role: string;
  created_at: string;
}

const JOB_NAME = "find-employer-prospects";

const AdminGrowth = () => {
  const { toast } = useToast();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [emailDrafts, setEmailDrafts] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: p }, { data: s }, { data: lock }] = await Promise.all([
      supabase.from("employer_prospects").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("invite_signups").select("id, code, new_user_role, created_at").order("created_at", { ascending: false }).limit(50),
      supabase.from("job_locks").select("paused_reason").eq("job_name", JOB_NAME).maybeSingle(),
    ]);
    setProspects((p as Prospect[]) || []);
    setSignups((s as Signup[]) || []);
    setPaused(Boolean(lock?.paused_reason));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const togglePaused = async (next: boolean) => {
    const { error } = await supabase.from("job_locks").upsert(
      {
        job_name: JOB_NAME,
        locked_until: new Date().toISOString(),
        paused_reason: next ? "Paused by an admin" : null,
      },
      { onConflict: "job_name" },
    );
    if (error) {
      toast({ variant: "destructive", title: "Couldn't change that", description: error.message });
      return;
    }
    setPaused(next);
    toast({ title: next ? "Prospect finding paused" : "Prospect finding switched back on" });
  };

  const saveEmail = async (id: string) => {
    const email = (emailDrafts[id] || "").trim();
    if (!email) return;
    const { error } = await supabase.from("employer_prospects").update({ contact_email: email }).eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Couldn't save", description: error.message });
      return;
    }
    toast({ title: "Email saved" });
    load();
  };

  const send = async (p: Prospect) => {
    setBusyId(p.id);
    const { data, error } = await supabase.functions.invoke("send-prospect-email", {
      body: { prospectId: p.id },
    });
    setBusyId(null);
    const message = (data as any)?.error || error?.message;
    if (message) {
      toast({ variant: "destructive", title: "Not sent", description: message });
      return;
    }
    toast({ title: "Sent", description: `One message went to ${p.contact_email}.` });
    load();
  };

  const discard = async (id: string) => {
    const { error } = await supabase.from("employer_prospects").update({ status: "discarded" }).eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Couldn't discard", description: error.message });
      return;
    }
    load();
  };

  const waiting = prospects.filter((p) => p.status === "new");
  const sent = prospects.filter((p) => p.status === "sent");

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 pt-24 pb-16 space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Growth</h1>
          <p className="text-muted-foreground">
            Employers found advertising in public, and people who joined through invite links.
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Nightly prospect finding</CardTitle>
              <CardDescription>
                Builds the list below. Nothing is ever emailed without you pressing send.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{paused ? "Paused" : "On"}</span>
              <Switch checked={!paused} onCheckedChange={(v) => togglePaused(!v)} />
            </div>
          </CardHeader>
        </Card>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Waiting for you ({waiting.length})</CardTitle>
                <CardDescription>Add an email address, then send one message.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {waiting.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nothing waiting. The agent runs overnight.</p>
                )}
                {waiting.map((p) => (
                  <div key={p.id} className="rounded-lg border border-border p-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{p.company_name}</span>
                      {p.role_title && <Badge variant="secondary">{p.role_title}</Badge>}
                      {p.role_location && <span className="text-sm text-muted-foreground">{p.role_location}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {p.estimated_agency_fee
                        ? `An agency would charge roughly £${p.estimated_agency_fee.toLocaleString()} for this hire.`
                        : "No salary shown on the advert."}{" "}
                      <a href={p.source_url} target="_blank" rel="noopener noreferrer" className="underline">
                        See the advert
                      </a>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Input
                        className="max-w-xs"
                        placeholder="Contact email"
                        defaultValue={p.contact_email ?? ""}
                        onChange={(e) => setEmailDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                      />
                      <Button variant="outline" onClick={() => saveEmail(p.id)}>
                        Save email
                      </Button>
                      <Button
                        onClick={() => send(p)}
                        disabled={!p.contact_email || busyId === p.id}
                        className="gap-2"
                      >
                        {busyId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Send one invitation
                      </Button>
                      <Button variant="ghost" onClick={() => discard(p.id)} className="gap-2">
                        <Trash2 className="h-4 w-4" /> Discard
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Already contacted ({sent.length})</CardTitle>
                <CardDescription>One message each. We never chase.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {sent.length === 0 && <p className="text-sm text-muted-foreground">Nobody yet.</p>}
                {sent.map((p) => (
                  <div key={p.id} className="flex flex-wrap justify-between gap-2 text-sm">
                    <span>
                      {p.company_name} — {p.contact_email}
                    </span>
                    <span className="text-muted-foreground">
                      {p.sent_at ? new Date(p.sent_at).toLocaleDateString("en-GB") : ""}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Joined through an invite link ({signups.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {signups.length === 0 && <p className="text-sm text-muted-foreground">Nobody yet.</p>}
                {signups.map((s) => (
                  <div key={s.id} className="flex flex-wrap justify-between gap-2 text-sm">
                    <span>
                      {s.new_user_role} · code {s.code}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminGrowth;
