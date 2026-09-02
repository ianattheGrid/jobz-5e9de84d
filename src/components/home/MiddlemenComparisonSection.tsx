import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Database,
  FileText,
  Send,
  Sparkles,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HIRING_MODELS, type HiringModel } from "@/data/hiringModels";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

const ICONS = {
  briefcase: Briefcase,
  database: Database,
  bot: Bot,
  send: Send,
  sparkles: Sparkles,
} as const;

export const MiddlemenComparisonSection = () => {
  const [active, setActive] = useState<HiringModel | null>(null);
  const ActiveIcon = active ? ICONS[active.icon] : null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="max-w-2xl mb-10 space-y-3">
          <h2
            className={`text-3xl md:text-4xl font-bold leading-tight ${PRIMARY_COLOR_PATTERN}`}
          >
            Who takes a cut, and how
          </h2>
          <p className="text-lg text-foreground">
            Agencies are not the only middlemen any more. Tap a model to see what it
            really costs — and what it does with your CV.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HIRING_MODELS.map((model) => {
            const Icon = ICONS[model.icon];
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => setActive(model)}
                aria-label={`See how ${model.name} works`}
                className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  model.highlight
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    : "border-border bg-card hover:border-primary/50 hover:shadow-lg"
                }`}
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                      model.highlight
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
                      model.highlight
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {model.costBadge}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-foreground">{model.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{model.tagline}</p>

                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  See the detail
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Pricing described as publicly stated by each type of platform at the time of
          writing. Figures describe the charging model rather than a quote.
        </p>

        <div className="mt-8">
          <Button asChild>
            <Link
              to="/how-hiring-really-works"
              className="inline-flex items-center gap-2"
            >
              See the full breakdown
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-lg">
          {active && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                      active.highlight
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {ActiveIcon && <ActiveIcon className="h-5 w-5" />}
                  </span>
                  <div>
                    <DialogTitle className="text-xl">{active.name}</DialogTitle>
                    <DialogDescription>{active.tagline}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div className="rounded-xl border border-border p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Wallet className="h-4 w-4 text-primary" />
                    {active.whoPays} pays
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{active.howMuch}</p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <FileText className="h-4 w-4 text-primary" />
                    What happens to your CV
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {active.whatHappensToYourCv}
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-4 ${
                    active.highlight
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted/40"
                  }`}
                >
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <TriangleAlert className="h-4 w-4 text-primary" />
                    {active.highlight ? "The trade-off" : "The catch"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{active.theCatch}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MiddlemenComparisonSection;
