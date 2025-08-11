import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function CVRedirect() {
  const [params] = useSearchParams();
  const path = params.get("path") || "";

  useEffect(() => {
    const go = async () => {
      try {
        if (!path) return;
        const { data, error } = await supabase.functions.invoke('get-cv-signed-url', {
          body: { path: decodeURIComponent(path), expiresIn: 3600 }
        });
        if (error) throw error;
        const url = (data as any)?.url as string | undefined;
        if (!url) throw new Error('No signed URL returned');
        window.location.replace(`${url}#v=${Date.now()}`);
      } catch (e) {
        console.error('Failed to redirect to CV', e);
      }
    };
    go();
  }, [path]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Preparing your CV…</p>
        <noscript>
          <p className="mt-2">JavaScript is required to open your CV.</p>
        </noscript>
      </div>
    </main>
  );
}
