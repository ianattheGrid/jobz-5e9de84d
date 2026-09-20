import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Starfield } from "@/components/ui/starfield";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[88vh] w-full overflow-hidden">
      <img
        src="/lovable-uploads/7be09af5-7186-41b7-867e-8354c980e8a5.png"
        alt="Astronaut in futuristic desert landscape representing exploration of new hiring frontiers"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Depth: darken, then fade into the page background */}
      <div className="absolute inset-0 bg-background/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/30 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/20 to-transparent" />

      <Starfield density="low" nebula={false} className="opacity-60" />

      <div className="relative z-10 mx-auto flex min-h-[88vh] w-full max-w-6xl flex-col justify-end px-5 pb-20 pt-32 sm:px-8 sm:pb-28">
        <div className="max-w-3xl">
          <p className="eyebrow mb-5 text-primary">Hiring, without the middlemen</p>

          <h1 className="display-heading text-4xl leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Welcome to what&apos;s next.
            <span className="block text-primary">
              This is how you&apos;ll do hiring from now on.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base text-foreground/75 sm:text-xl">
            You&apos;re at the controls. We get out of the way. Automation, AI, recommendations, and
            hiring bonuses — all in one space.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/signup">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/jobs">Browse jobs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
