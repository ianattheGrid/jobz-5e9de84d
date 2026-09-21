import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { rememberSource } from "@/utils/growth/source";
import { Sparkles, Loader2, ArrowRight, TrendingUp } from "lucide-react";

interface JobWorthResult {
  roleTitle: string;
  lowSalary: number;
  midSalary: number;
  highSalary: number;
  summary: string;
  raisesPay: string[];
  confidence: string;
  agencyFee: number | null;
  jobzMonthly: number;
}

const money = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

export default function JobWorth() {
  const { toast } = useToast();
  const [jobText, setJobText] = useState("");
  const [followUpEmail, setFollowUpEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobWorthResult | null>(null);

  useEffect(() => {
    rememberSource("salary_tool");
    document.title = "What's this job actually worth? | Jobz";
    const desc = document.querySelector('meta[name="description"]');
    const previous = desc?.getAttribute("content") ?? null;
    desc?.setAttribute(
      "content",
      "Free Bristol salary check: paste a job title or advert and see the pay range, plus what an agency would charge an employer to fill it.",
    );
    return () => {
      if (previous !== null) desc?.setAttribute("content", previous);
    };
  }, []);

  const run = async () => {
    if (jobText.trim().length < 10) {
      toast({
        title: "We need a bit more",
        description: "A job title is enough, but an advert gives a better answer.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("job-worth", {
        body: { jobText, followUpEmail: followUpEmail || undefined },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data.result as JobWorthResult);
      if (followUpEmail) {
        toast({ title: "We'll send you one email", description: "One follow-up only. Never a mailing list." });
      }
    } catch (err: any) {
      toast({
        title: "Couldn't check that one",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/what-is-this-job-worth` : "";

  return (
    <CosmicBackground mode="full">
      <NavBar />

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl min-h-[calc(100vh-6rem)]">
        <header className="text-center mb-10">
          <Badge className="mb-4 bg-primary/20 text-primary border border-primary/40">Free · No account needed</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">What's this job actually worth?</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Paste a job title or a whole advert. We'll show the Bristol pay range, what pushes it up — and what an
            agency would charge the employer to fill it.
          </p>
        </header>

        <Card className="cosmic-form bg-black/40 backdrop-blur-xl border-primary/30">
          <CardHeader>
            <CardTitle className="text-white">The role</CardTitle>
            <CardDescription className="text-white/60">Nothing is saved unless you ask us to email you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="job-text" className="text-white/80">
                Job title or advert
              </Label>
              <Textarea
                id="job-text"
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                rows={8}
                placeholder="e.g. Senior React developer, Bristol, hybrid — or paste the whole advert"
                className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            <div>
              <Label htmlFor="follow-up" className="text-white/80">
                Email me this (optional)
              </Label>
              <Input
                id="follow-up"
                type="email"
                value={followUpEmail}
                onChange={(e) => setFollowUpEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40 max-w-sm"
              />
              <p className="text-xs text-white/50 mt-1">
                One follow-up email, once. No mailing list, no chasing.
              </p>
            </div>

            <div className="flex justify-end">
              <Button onClick={run} disabled={loading} size="lg" className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {loading ? "Checking..." : "Check what it's worth"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <section className="mt-8 space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border-primary/30">
              <CardHeader>
                <CardTitle className="text-white text-2xl">{result.roleTitle}</CardTitle>
                <CardDescription className="text-white/70 text-base">{result.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-white/50 text-sm">Lower end</p>
                    <p className="text-white text-xl font-semibold">{money(result.lowSalary)}</p>
                  </div>
                  <div>
                    <p className="text-primary text-sm">Typical</p>
                    <p className="text-primary text-3xl font-bold">{money(result.midSalary)}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Top end</p>
                    <p className="text-white text-xl font-semibold">{money(result.highSalary)}</p>
                  </div>
                </div>
                <p className="text-white/50 text-xs mt-4 text-center">
                  Publicly reported ranges for Bristol and the South West, not a guarantee. Confidence:{" "}
                  {result.confidence}.
                </p>
              </CardContent>
            </Card>

            {result.raisesPay?.length > 0 && (
              <Card className="bg-black/40 backdrop-blur-xl border-emerald-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">What pushes the pay up</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.raisesPay.map((r, i) => (
                      <li key={i} className="flex gap-2 text-white/80">
                        <TrendingUp className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.agencyFee && (
              <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">What the employer pays to find you</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-white/80">
                    A recruitment agency charging 20% would take{" "}
                    <strong className="text-amber-400">{money(result.agencyFee)}</strong> for this hire. That money
                    comes out of the same budget as your salary.
                  </p>
                  <p className="text-white/80">
                    On Jobz the employer pays <strong className="text-primary">£{result.jobzMonthly} a month</strong>,
                    no contract and no commission — and talks to you directly.
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="bg-primary/10 backdrop-blur-xl border-primary/40">
              <CardHeader>
                <CardTitle className="text-white text-xl">Want Bristol employers to find you?</CardTitle>
                <CardDescription className="text-white/70">
                  A free profile takes a couple of minutes and gives you a link for your LinkedIn bio. Employers come
                  to you — no agency in the middle.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/candidate/signup?from=salary_tool">
                    Create my free profile <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/cv-review">Get a free CV review</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/15">
              <CardHeader>
                <CardTitle className="text-white text-lg">Know someone who'd want this?</CardTitle>
                <CardDescription className="text-white/70">Free, no sign-up. Pass it on.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`See what a job is really worth in Bristol: ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Share on WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Share on LinkedIn
                  </a>
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
