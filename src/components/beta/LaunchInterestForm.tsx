import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { launchInterestSchema } from "@/lib/beta";

export function LaunchInterestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  if (saved) return <p role="status" className="py-4 text-foreground">Thanks — you’re on the launch-interest list. We’ll email you when this app launches.</p>;
  return <form className="space-y-5" onSubmit={async (event) => {
    event.preventDefault();
    if (pending) return;
    const parsed = launchInterestSchema.safeParse({ name, email, consent });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message || "Please check your details."); return; }
    setPending(true); setError("");
    try {
      const { data, error: failure } = await supabase.functions.invoke("register-launch-interest", { body: parsed.data });
      if (failure || data?.saved !== true) throw new Error("We couldn't save your interest. Please try again.");
      setSaved(true);
    } catch { setError("We couldn't save your interest. Please try again."); }
    finally { setPending(false); }
  }}>
    <p className="text-sm text-muted-foreground">This registers launch interest, not an app account. No password or payment needed.</p>
    <div className="space-y-2"><Label htmlFor="launch-name">Name (optional)</Label><Input id="launch-name" autoComplete="name" maxLength={100} value={name} onChange={(event) => setName(event.target.value)} disabled={pending} /></div>
    <div className="space-y-2"><Label htmlFor="launch-email">Email address</Label><Input id="launch-email" type="email" autoComplete="email" required maxLength={255} value={email} onChange={(event) => setEmail(event.target.value)} disabled={pending} /></div>
    <div className="flex items-start gap-3"><Checkbox id="launch-consent" checked={consent} onCheckedChange={(checked) => setConsent(checked === true)} disabled={pending} /><Label htmlFor="launch-consent" className="leading-5">Email me when this app launches.</Label></div>
    <p className="text-xs text-muted-foreground">Your email stays private and is used for the Jobz launch announcement.</p>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Button type="submit" className="w-full" disabled={pending}>{pending ? "Saving…" : "Register interest"}</Button>
  </form>;
}