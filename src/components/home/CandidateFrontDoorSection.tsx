import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileSearch, Link2, Radar } from "lucide-react";

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
    <section className="relative py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <p className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">
            Looking for work?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Start with something useful. No sign-up wall.
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            You don't need another job board account. Get your CV reviewed for free, and only make a
            profile if you like what you see.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-primary/20 bg-card/60 backdrop-blur p-6"
            >
              <step.icon className="h-7 w-7 text-primary mb-4" />
              <h3 className="text-foreground font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link to="/cv-review">
              Review my CV free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
