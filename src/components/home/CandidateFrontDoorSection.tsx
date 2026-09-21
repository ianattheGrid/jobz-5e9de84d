import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileSearch, Link2, PoundSterling, Radar } from "lucide-react";
import { SectionShell } from "@/components/ui/section-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { Starfield } from "@/components/ui/starfield";

const STEPS = [
  {
    icon: FileSearch,
    title: "Get a free CV review",
    body: "Paste your CV and get an honest score, the things holding it back, and stronger wording you can use today. No account needed.",
  },
  {
    icon: Link2,
    title: "Turn it into a profile you can share",
    body: "One clean link for your LinkedIn bio, a message or the bottom of your CV — so people can see what you do without you applying anywhere.",
  },
  {
    icon: Radar,
    title: "Let the right roles find you",
    body: "Say what you want next and employers come to you directly. No agency in the middle, no application black hole.",
  },
];

export const CandidateFrontDoorSection = () => {
  return (
    <SectionShell size="lg">
      <Starfield density="low" />
      <div>
        <div className="max-w-3xl">
          <p className="eyebrow mb-4 text-primary">Looking for work?</p>
          <h2 className="display-heading mb-5 text-3xl tracking-tight text-foreground sm:text-5xl">
            Start with something useful. No sign-up wall.
          </h2>
          <p className="mb-12 text-lg text-foreground/70">
            You don't need another job board account. Get your CV reviewed for free, and only make a
            profile if you like what you see.
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <GlassCard key={step.title} interactive>
              <step.icon className="mb-5 h-7 w-7 text-primary" />
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/65">{step.body}</p>
            </GlassCard>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link to="/cv-review">
              Review my CV free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link to="/what-is-this-job-worth">
              What's this job worth? <PoundSterling className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </SectionShell>
  );
};
