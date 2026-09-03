import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, Copy } from "lucide-react";

interface TailorResult {
  headline: string;
  alignment: string[];
  gaps: { requirement: string; advice: string }[];
  suggestedSummary: string;
  rewrittenBullets: string[];
  keywordGaps: { keyword: string; whereToAdd: string }[];
  coverLetterDraft: string;
}

interface TailorCvPanelProps {
  jobId: number;
  onUseCoverLetter: (text: string) => void;
}

const TailorCvPanel = ({ jobId, onUseCoverLetter }: TailorCvPanelProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cvText, setCvText] = useState("");
  const [result, setResult] = useState<TailorResult | null>(null);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copied` });
    } catch {
      toast({ title: "Could not copy", variant: "destructive" });
    }
  };

  const run = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("tailor-cv", {
        body: { jobId, cvText: cvText.trim() || undefined },
      });
      if (error) {
        // supabase-js wraps non-2xx responses; the useful message is in the body.
        let serverMessage = "";
        const res = (error as any)?.context;
        if (res && typeof res.json === "function") {
          try {
            const body = await res.clone().json();
            if (typeof body?.error === "string") serverMessage = body.error;
          } catch {
            /* body not JSON */
          }
        }
        throw new Error(serverMessage || error.message);
      }
      if (data?.error) throw new Error(data.error);
      setResult(data.result as TailorResult);
    } catch (e: any) {
      toast({
        title: "Couldn't tailor your CV",
        description: e?.message || "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  if (!open) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Tailor my CV for this role
      </Button>
    );
  }

  return (
    <Card className="p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Tailor my CV for this role
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            Suggestions only — nothing is sent to the employer until you submit, and nothing is invented.
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>

      {!result && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">
              Paste your CV text (optional — we'll use your Jobz profile if you skip this)
            </label>
            <Textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste your CV here for sharper suggestions..."
              className="h-32"
            />
          </div>
          <Button type="button" onClick={run} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Tailoring...
              </>
            ) : (
              "Tailor my CV"
            )}
          </Button>
        </>
      )}

      {result && (
        <div className="space-y-4 text-sm">
          <p className="font-medium">{result.headline}</p>

          {result.alignment?.length > 0 && (
            <div>
              <h5 className="font-semibold mb-1">What already matches</h5>
              <ul className="list-disc pl-5 space-y-1">
                {result.alignment.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {result.gaps?.length > 0 && (
            <div>
              <h5 className="font-semibold mb-1">What's missing</h5>
              <ul className="space-y-2">
                {result.gaps.map((g, i) => (
                  <li key={i}>
                    <span className="font-medium">{g.requirement}</span>
                    <span className="block text-muted-foreground">{g.advice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestedSummary && (
            <div>
              <div className="flex items-center justify-between">
                <h5 className="font-semibold mb-1">Suggested CV summary</h5>
                <Button type="button" variant="ghost" size="sm" onClick={() => copy(result.suggestedSummary, "Summary")}>
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
              </div>
              <p className="text-muted-foreground">{result.suggestedSummary}</p>
            </div>
          )}

          {result.rewrittenBullets?.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <h5 className="font-semibold mb-1">Rewritten bullet points</h5>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copy(result.rewrittenBullets.map((b) => `• ${b}`).join("\n"), "Bullets")}
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {result.rewrittenBullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {result.keywordGaps?.length > 0 && (
            <div>
              <h5 className="font-semibold mb-2">Keywords a screener will look for</h5>
              <div className="space-y-2">
                {result.keywordGaps.map((k, i) => (
                  <div key={i} className="flex flex-wrap items-baseline gap-2">
                    <Badge variant="secondary">{k.keyword}</Badge>
                    <span className="text-muted-foreground">{k.whereToAdd}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.coverLetterDraft && (
            <div>
              <h5 className="font-semibold mb-1">Draft cover letter</h5>
              <p className="whitespace-pre-wrap text-muted-foreground">{result.coverLetterDraft}</p>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    onUseCoverLetter(result.coverLetterDraft);
                    toast({ title: "Cover letter added — edit it before you submit" });
                  }}
                >
                  Use this cover letter
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => copy(result.coverLetterDraft, "Cover letter")}>
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
              </div>
            </div>
          )}

          <Button type="button" variant="ghost" size="sm" onClick={() => setResult(null)}>
            Start again
          </Button>
        </div>
      )}
    </Card>
  );
};

export default TailorCvPanel;
