import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HIRING_MODELS } from "@/data/hiringModels";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

export const MiddlemenComparisonSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="max-w-3xl mb-10 space-y-4">
          <h2 className={`text-3xl md:text-4xl font-bold leading-tight ${PRIMARY_COLOR_PATTERN}`}>
            Who takes a cut, and how
          </h2>
          <p className="text-lg text-foreground">
            Agencies and job boards are not the only middlemen any more. A new wave of AI
            hiring platforms charges a percentage of your salary, or charges you a
            subscription to blast your CV at hundreds of employers. Here is what each
            model actually costs — and what it does with your application.
          </p>
        </div>

        {/* Table from md up */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-left">
                <th className="p-4 font-semibold text-foreground">Model</th>
                <th className="p-4 font-semibold text-foreground">Who pays</th>
                <th className="p-4 font-semibold text-foreground">How much</th>
                <th className="p-4 font-semibold text-foreground">What happens to your CV</th>
                <th className="p-4 font-semibold text-foreground">The catch</th>
              </tr>
            </thead>
            <tbody>
              {HIRING_MODELS.map((model) => (
                <tr
                  key={model.id}
                  className={`border-t border-border align-top ${
                    model.highlight ? "bg-primary/10" : ""
                  }`}
                >
                  <td className="p-4 font-semibold text-foreground whitespace-nowrap">
                    {model.name}
                  </td>
                  <td className="p-4 text-muted-foreground">{model.whoPays}</td>
                  <td className="p-4 text-muted-foreground">{model.howMuch}</td>
                  <td className="p-4 text-muted-foreground">{model.whatHappensToYourCv}</td>
                  <td className="p-4 text-muted-foreground">{model.theCatch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards on mobile */}
        <div className="grid gap-4 md:hidden">
          {HIRING_MODELS.map((model) => (
            <Card
              key={model.id}
              className={`p-5 space-y-3 ${model.highlight ? "border-primary bg-primary/10" : ""}`}
            >
              <h3 className="text-lg font-bold text-foreground">{model.name}</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-semibold text-foreground">Who pays</dt>
                  <dd className="text-muted-foreground">{model.whoPays}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">How much</dt>
                  <dd className="text-muted-foreground">{model.howMuch}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">What happens to your CV</dt>
                  <dd className="text-muted-foreground">{model.whatHappensToYourCv}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">The catch</dt>
                  <dd className="text-muted-foreground">{model.theCatch}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Pricing described as publicly stated by each type of platform at the time of
          writing. Figures describe the charging model rather than a quote.
        </p>

        <div className="mt-8">
          <Button asChild>
            <Link to="/how-hiring-really-works" className="inline-flex items-center gap-2">
              See the full breakdown
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MiddlemenComparisonSection;
