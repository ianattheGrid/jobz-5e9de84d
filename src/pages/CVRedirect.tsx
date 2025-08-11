import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function CVRedirect() {
  const [params] = useSearchParams();
  const path = params.get("path") || "";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = error ? "CV Error" : "Opening CV…";
  }, [error]);

  useEffect(() => {
    let unsub: { data: { subscription: { unsubscribe: () => void } } } | null = null;
    let cancelled = false;

    const invokeWithToken = async (accessToken: string) => {
      try {
        const decoded = decodeURIComponent(path);
        const { data, error } = await supabase.functions.invoke('get-cv-signed-url', {
          body: { path: decoded, expiresIn: 3600 },
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (error) throw error;
        const url = (data as any)?.url as string | undefined;
        if (!url) throw new Error('No signed URL returned');
        window.location.replace(`${url}#v=${Date.now()}`);
      } catch (e) {
        console.error('Failed to redirect to CV', e);
        if (!cancelled) setError("We couldn't open your CV. Please try again, or re-upload it.");
      }
    };

    const go = async () => {
      if (!path) {
        setError("Invalid or missing CV path.");
        return;
      }
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session?.access_token) {
        await invokeWithToken(session.access_token);
        return;
      }
      // Wait briefly for session hydration in a new tab
      unsub = supabase.auth.onAuthStateChange((_evt, sess) => {
        if (sess?.access_token && !cancelled) {
          unsub?.data.subscription.unsubscribe();
          invokeWithToken(sess.access_token);
        }
      });
      // Timeout fallback
      setTimeout(() => {
        if (!cancelled) setError('Authentication required. Please sign in again.');
      }, 5000);
    };

    go();

    return () => {
      cancelled = true;
      unsub?.data.subscription.unsubscribe();
    };
  }, [path]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        {!error ? (
          <p className="text-sm text-muted-foreground">Preparing your CV…</p>
        ) : (
          <div>
            <h1 className="text-base font-medium">Unable to open CV</h1>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </div>
        )}
        <noscript>
          <p className="mt-2">JavaScript is required to open your CV.</p>
        </noscript>
      </div>
    </main>
  );
}
