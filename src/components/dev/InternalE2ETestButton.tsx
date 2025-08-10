import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export const InternalE2ETestButton = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"smoke" | "full">("smoke");
  const [resultOpen, setResultOpen] = useState(false);
  const [result, setResult] = useState<{ ok?: boolean; duration_ms?: number; error?: string; fn?: string } | null>(null);

  const enabled = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("e2e") === "1" || params.get("internal") === "1") return true;
    // Only show locally without query param
    return ["localhost", "127.0.0.1"].includes(window.location.hostname);
  }, []);

  if (!enabled) return null;

  const runTest = async () => {
    setLoading(true);
    try {
      const fn = mode === "smoke" ? "run-e2e-smoke" : "run-e2e-test";
      const { data, error } = await supabase.functions.invoke(fn, {
        body: { trigger: "manual", mode },
      });
      if (error) {
        console.error("E2E test error", { error, data });
        setResult({ ok: false, error: (data as any)?.error || error.message || "Unknown error", fn });
        setResultOpen(true);
        toast({
          title: "E2E test failed",
          description: (data as any)?.error || error.message || "Unknown error",
          variant: "destructive",
          duration: 8000,
        });
      } else {
        setResult({ ok: !!data?.ok, duration_ms: (data as any)?.duration_ms, fn });
        setResultOpen(true);
        toast({
          title: data?.ok ? "E2E test passed" : "E2E test finished",
          description: data?.ok
            ? `Duration: ${data.duration_ms}ms` 
            : ((data as any)?.error || "Unknown result"),
          duration: 8000,
        });
      }
    } catch (e: any) {
      toast({ title: "E2E test failed", description: String(e.message || e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!enabled) return;
    const already = sessionStorage.getItem('e2e-ran');
    if (!already) {
      sessionStorage.setItem('e2e-ran', '1');
      runTest();
    }
  }, [enabled]);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2">
        <Button variant="navy" onClick={() => setMode(mode === 'smoke' ? 'full' : 'smoke')} disabled={loading}>
          {mode === 'smoke' ? 'Mode: Smoke' : 'Mode: Full'}
        </Button>
        <Button variant="navy" onClick={runTest} disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Running…</> : (mode === 'smoke' ? 'Run smoke demo (internal)' : 'Run full demo (internal)')}
        </Button>
      </div>
      <Dialog open={resultOpen} onOpenChange={setResultOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{result?.ok ? "E2E test passed" : "E2E test failed"}</DialogTitle>
            <DialogDescription>
              {result?.ok ? `Duration: ${result?.duration_ms}ms` : (result?.error || "Unknown error")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <a
              href={`https://supabase.com/dashboard/project/lfwwhyjtbkfibxzefvkn/functions/${result?.fn}/logs`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Open logs
            </a>
            <Button variant="secondary" onClick={() => setResultOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
