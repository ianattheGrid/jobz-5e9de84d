import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, EyeOff, CheckCircle } from "lucide-react";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

export const ConnectorExplainer = () => {
  return (
    <section aria-labelledby="connector-explainer-title" className="py-14 bg-background">
      <div className="container mx-auto px-4">
        <h2 id="connector-explainer-title" className={`text-3xl font-bold text-center mb-3 ${PRIMARY_COLOR_PATTERN}`}>
          What is a Connector?
        </h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-10">
          Connectors are vetted people who anonymously introduce great candidates from their networks. We manage them; you stay in control; you only pay when someone’s hired.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-none shadow-lg bg-card">
            <CardHeader>
              <ShieldCheck className="h-10 w-10 text-primary mb-3" aria-hidden="true" />
              <CardTitle className={PRIMARY_COLOR_PATTERN}>Vetted & Managed</CardTitle>
              <CardDescription className="text-foreground">
                ID checks, behavior monitoring, and performance tracking ensure quality and compliance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg bg-card">
            <CardHeader>
              <EyeOff className="h-10 w-10 text-primary mb-3" aria-hidden="true" />
              <CardTitle className={PRIMARY_COLOR_PATTERN}>Anonymous by Default</CardTitle>
              <CardDescription className="text-foreground">
                Recommendations stay masked until both sides opt in—no spam, no direct access.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg bg-card">
            <CardHeader>
              <CheckCircle className="h-10 w-10 text-primary mb-3" aria-hidden="true" />
              <CardTitle className={PRIMARY_COLOR_PATTERN}>Perfect for Hard‑to‑Fill Roles</CardTitle>
              <CardDescription className="text-foreground">
                Tap extended networks beyond job boards when reach and speed really matter.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ConnectorExplainer;
