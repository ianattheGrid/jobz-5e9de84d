import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2, CheckCircle2, AlertTriangle, ArrowRight, Upload } from "lucide-react";

interface CvIssue {
  problem: string;
  fix: string;
}

interface CvBullet {
  before: string;
  after: string;
}

interface CvReviewResult {
  score: number;
  headline: string;
  strengths: string[];
  issues: CvIssue[];
  rewrittenBullets: CvBullet[];
  missingKeywords?: string[];
  suggestedTitles?: string[];
}

export default function CvReview() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cvText, setCvText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<CvReviewResult | null>(null);

  useEffect(() => {
    document.title = "Free CV Review | Jobz";
    const desc = document.querySelector('meta[name="description"]');
    const previous = desc?.getAttribute("content") ?? null;
    desc?.setAttribute(
      "content",
      "Get a free, instant CV review: an honest score, the fixes that matter and rewritten bullet points you can use today."
    );
    return () => {
      if (previous !== null) desc?.setAttribute("content", previous);
    };
  }, []);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const isText = file.type.startsWith("text/") || /\.(txt|md|rtf)$/i.test(file.name);
    if (!isText) {
      toast({
        title: "Please paste the text instead",
        description: "We can read plain text files here. For a PDF or Word CV, open it, select all, and paste below.",
      });
      return;
    }
    const text = await file.text();
    setCvText(text.slice(0, 20000));
  };

  const runReview = async () => {
    if (cvText.trim().length < 200) {
      toast({
        title: "We need a bit more",
        description: "Paste at least a few paragraphs of your CV so the review is useful.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setReview(null);
    try {
      const { data, error } = await supabase.functions.invoke("cv-review", {
        body: { cvText, targetRole: targetRole || undefined },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setReview(data.review as CvReviewResult);
    } catch (err: any) {
      toast({
        title: "Review failed",
        description: err.message || "We couldn't review that CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const scoreColour = (score: number) =>
    score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-rose-400";

  return (
    <CosmicBackground mode="full">
      <NavBar />

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl min-h-[calc(100vh-6rem)]">
        <header className="text-center mb-10">
          <Badge className="mb-4 bg-primary/20 text-primary border border-primary/40">Free · No account needed</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get an honest review of your CV in seconds
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Paste your CV below. We'll score it, tell you exactly what's holding it back, and rewrite your weakest
            bullet points — in your own words, not robot-speak.
          </p>
        </header>

        <Card className="cosmic-form bg-black/40 backdrop-blur-xl border-primary/30">
          <CardHeader>
            <CardTitle className="text-white">Your CV</CardTitle>
            <CardDescription className="text-white/60">
              Nothing is saved unless you choose to create a Jobz profile afterwards.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="target-role" className="text-white/80">
                Role you're aiming for (optional)
              </Label>
              <Input
                id="target-role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. 1st line IT support, Bristol"
                className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            <div>
              <Label htmlFor="cv-text" className="text-white/80">
                Paste your CV text
              </Label>
              <Textarea
                id="cv-text"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={12}
                placeholder="Open your CV, select all, copy, and paste it here..."
                className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
              <p className="text-xs text-white/50 mt-1">{cvText.trim().length} characters</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-white/70 cursor-pointer hover:text-white">
                <Upload className="h-4 w-4" />
                Upload a .txt file
                <input
                  type="file"
                  accept=".txt,.md,.rtf,text/plain"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>

              <Button onClick={runReview} disabled={loading} size="lg" className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {loading ? "Reviewing..." : "Review my CV"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {review && (
          <section className="mt-8 space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border-primary/30">
              <CardHeader>
                <div className="flex items-baseline gap-3">
                  <span className={`text-5xl font-bold ${scoreColour(review.score)}`}>{Math.round(review.score)}</span>
                  <span className="text-white/50 text-lg">/ 100</span>
                </div>
                <CardDescription className="text-white/80 text-base pt-2">{review.headline}</CardDescription>
              </CardHeader>
            </Card>

            {review.strengths?.length > 0 && (
              <Card className="bg-black/40 backdrop-blur-xl border-emerald-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">What's working</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {review.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-white/80">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {review.issues?.length > 0 && (
              <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Fix these first</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {review.issues.map((issue, i) => (
                      <li key={i} className="flex gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-medium">{issue.problem}</p>
                          <p className="text-white/70 text-sm mt-1">{issue.fix}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {review.rewrittenBullets?.length > 0 && (
              <Card className="bg-black/40 backdrop-blur-xl border-primary/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Stronger bullet points</CardTitle>
                  <CardDescription className="text-white/60">
                    Check the details are still accurate before you use them.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {review.rewrittenBullets.map((b, i) => (
                    <div key={i} className="rounded-lg border border-white/10 p-4">
                      <p className="text-white/50 text-sm line-through">{b.before}</p>
                      <p className="text-white mt-2">{b.after}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {(review.missingKeywords?.length || review.suggestedTitles?.length) && (
              <div className="grid md:grid-cols-2 gap-6">
                {review.missingKeywords?.length ? (
                  <Card className="bg-black/40 backdrop-blur-xl border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Keywords you're missing</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {review.missingKeywords.map((k) => (
                        <Badge key={k} variant="secondary">
                          {k}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                ) : null}

                {review.suggestedTitles?.length ? (
                  <Card className="bg-black/40 backdrop-blur-xl border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Roles you're a fit for</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {review.suggestedTitles.map((t) => (
                        <Badge key={t} variant="secondary">
                          {t}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            )}

            <Card className="bg-primary/10 backdrop-blur-xl border-primary/40">
              <CardHeader>
                <CardTitle className="text-white text-xl">Want employers to come to you?</CardTitle>
                <CardDescription className="text-white/70">
                  Create a free Jobz profile and we'll match you to roles automatically — no applying into the void.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="lg" className="gap-2" onClick={() => navigate("/candidate/signup")}>
                  Create my free profile <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <Footer />
    </CosmicBackground>
  );
}
