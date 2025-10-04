import { EmployeeRecruitmentCalculator } from "@/components/calculators/EmployeeRecruitmentCalculator";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

export const CandidateCostSection = () => {
  return (
    <section className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <h2 className={`text-4xl font-bold leading-tight ${PRIMARY_COLOR_PATTERN}`}>
              Why great people don't get hired (and it's not your fault)
            </h2>
            
            {/* Problem Section */}
            <div className="space-y-4">
              <p className="text-lg text-foreground">
                Most SMEs don't pass on you because you're not good enough — it's because hiring is expensive and slow.
              </p>
              
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>LinkedIn recruiter tools can cost companies over <strong>£10,000 a year</strong> just to search for you.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Agencies often charge <strong>the same again</strong> to place one person.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>For a small business, that upfront outlay is hard to justify — so they delay, hire less, or never even see your profile.</span>
                </li>
              </ul>
              
              <p className="text-foreground font-semibold italic">
                Use our hiring cost calculator to see what you'd cost an SME in the old system. It's eye‑opening.
              </p>
            </div>
            
            {/* Solution Section */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="text-2xl font-bold text-foreground">
              Jobz changes everything
              </h3>
              
              <p className="text-xl font-bold text-primary">
                With Jobz, the most you'll cost an employer is £9.
              </p>
              
              <ul className="space-y-2 text-foreground">
                <li className="flex items-center gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>No recruiters.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>No search licenses.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>No hidden fees.</span>
                </li>
              </ul>
              
              <div className="space-y-2 pt-4">
                <p className="text-foreground font-semibold">
                  SMEs can finally meet talent without the price tag.
                </p>
                <p className="text-foreground font-semibold">
                  More businesses can say "yes" — faster.
                </p>
              </div>
              
              <p className="text-lg text-foreground pt-4">
                <strong>Create your profile. Be discoverable.</strong> If a great SME can afford to talk to you for £9, imagine how many more doors open.
              </p>
            </div>
          </div>
          
          {/* Right Column - Calculator */}
          <div className="lg:sticky lg:top-8">
            <EmployeeRecruitmentCalculator />
          </div>
        </div>
      </div>
    </section>
  );
};
