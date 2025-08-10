import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const InternalE2ETestButton = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const enabled = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("e2e") === "1" || params.get("internal") === "1";
  }, []);

  if (!enabled) return null;

  const runTest = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("run-e2e-test", {
        body: { trigger: "manual" },
      });
      if (error) throw error;
      toast({
        title: data?.ok ? "E2E test passed" : "E2E test finished",
        description: data?.ok
          ? `Duration: ${data.duration_ms}ms` 
          : (data?.error || "Unknown result"),
        duration: 8000,
      });
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
      <Button variant="navy" onClick={runTest} disabled={loading}>
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Running…</> : "Run full demo (internal)"}
      </Button>
    </div>
  );
};
