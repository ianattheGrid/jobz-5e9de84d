import { createContext, useContext, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { BETA_PREVIEW, isBetaAccountPath, isBetaPrivatePath } from "@/lib/beta";
import { LaunchInterestForm } from "./LaunchInterestForm";

const BetaContext = createContext({ openInterest: () => {}, isOwner: false });
export const useBetaPreview = () => useContext(BetaContext);

export function BetaPreview({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [checking, setChecking] = useState(true);
  const location = useLocation();
  useEffect(() => {
    let active = true;
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const result = user ? await supabase.rpc("current_user_is_admin") : null;
      if (active) { setIsOwner(result?.data === true && !result.error); setChecking(false); }
    };
    check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { setChecking(true); setTimeout(check, 0); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  const blocked = isBetaAccountPath(location.pathname) || (!isOwner && isBetaPrivatePath(location.pathname));
  const privatePath = isBetaPrivatePath(location.pathname);
  return <BetaContext.Provider value={{ openInterest: () => setOpen(true), isOwner }}>
    {BETA_PREVIEW && !location.pathname.startsWith("/admin") && <aside aria-label="Beta notice" className="relative z-40 mt-16 border-b border-border bg-muted/90 px-4 py-3">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground">We’re in beta. Explore what’s coming, and register your interest to hear when we launch.</p>
        <div className="flex items-center gap-4"><Button size="sm" variant="outline" onClick={() => setOpen(true)}>Register interest</Button><a className="text-xs text-muted-foreground hover:text-foreground" href="https://dgrid.co">Back to theGrid</a></div>
      </div>
    </aside>}
    {BETA_PREVIEW && checking && privatePath ? <p className="p-8 text-muted-foreground">Checking access…</p> : BETA_PREVIEW && blocked ? <Navigate to="/register-interest" replace /> : children}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-md"><DialogHeader><DialogTitle>Register interest</DialogTitle></DialogHeader>{open && <LaunchInterestForm />}</DialogContent></Dialog>
  </BetaContext.Provider>;
}

export function LaunchInterestPage() {
  return <main className="mx-auto min-h-[70vh] max-w-md px-5 py-12"><Link className="text-sm text-muted-foreground hover:text-foreground" to="/">← Explore Jobz</Link><h1 className="mb-6 mt-8 text-3xl font-semibold text-foreground">Register interest</h1><LaunchInterestForm /></main>;
}