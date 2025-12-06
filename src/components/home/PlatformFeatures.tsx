
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FileText, Coins, Bot, Calculator, User, Target, Users, MapPin, HandCoins, ListCheck, Clock, Info, Workflow, Search, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmployeeRecruitmentCalculator } from "@/components/calculators/EmployeeRecruitmentCalculator";
import { BonusCalculator } from "@/components/candidate/sections/commission/BonusCalculator";
import { cn } from "@/lib/utils";

interface PlatformFeaturesProps {
  activeTab: string;
}

export const PlatformFeatures = ({ activeTab }: PlatformFeaturesProps) => {
  const [bonusSampleSalary, setBonusSampleSalary] = React.useState("");
  const [bonusFeePercentage, setBonusFeePercentage] = React.useState(7);
  const [bonusSplitPercentage, setBonusSplitPercentage] = React.useState(50);
  
  return (
    <section className="py-12 container mx-auto px-4 platform-tabs">
      <Tabs value={activeTab} className="w-full max-w-4xl mx-auto">
        {/* EMPLOYERS TAB */}
        <TabsContent value="hiring" className="mt-0 space-y-8 radix-tabpanel">
          {/* Intro Text */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hiring shouldn't cost more than the value you get. Post unlimited roles for <span className="font-semibold text-foreground">£9/month</span>. 
              Set optional bonuses for harder-to-fill roles. Tap into our anonymous Connector network for unrivalled sourcing—no agencies, no middlemen.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="navy" className="w-full sm:w-auto" aria-label="How Jobz works for employers">
                  <Info className="mr-2 h-4 w-4" />Learn more
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Your hiring team for £9/month</DialogTitle>
                  <DialogDescription>
                    Post unlimited roles. Hire directly. For harder-to-fill vacancies, set a "You're Hired" bonus and activate our anonymous Connector network for sourcing reach no agency can match.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-foreground text-sm">
                  <div>
                    <p className="font-medium mb-2">How it works:</p>
                    <ol className="list-decimal pl-5 space-y-1.5">
                      <li>Post roles—unlimited, for one flat monthly fee</li>
                      <li>For tougher vacancies, set a "You're Hired" bonus to attract talent</li>
                      <li>Activate Connectors anonymously for sourcing power on demand</li>
                      <li>Review candidates, connect directly, hire without middlemen</li>
                    </ol>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Why it's different:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li>AI surfaces hidden gems—career changers, rising talent</li>
                      <li>Candidates stay anonymous until both sides opt in</li>
                      <li>Pay bonuses on success, not fees on hope</li>
                      <li>Access a Connector network no competitor can offer</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full sm:w-auto" aria-label="Open employee recruitment cost calculator">
                  <Calculator className="mr-2 h-4 w-4" />Try cost calculator
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                <EmployeeRecruitmentCalculator />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={FileText}
              title="Post Unlimited. Pay Fixed."
              description="£9/month for all your roles. No per-listing fees, no hidden costs, no surprises."
            />
            <FeatureCard
              icon={Coins}
              title="Bonuses When You Need Them"
              description="For harder-to-fill roles, set a 'You're Hired' bonus. Only pay when someone gets hired."
            />
            <FeatureCard
              icon={Search}
              title="Unrivalled Sourcing, On Demand"
              description="Activate our anonymous Connector network for reach no agency can match—only when you need it."
            />
            <FeatureCard
              icon={Workflow}
              title="From First Click to First Day"
              description="Anonymous introductions, direct conversations, seamless hiring. No middlemen, no delays."
            />
          </div>
        </TabsContent>

        {/* CANDIDATES TAB */}
        <TabsContent value="candidates" className="mt-8 space-y-8 radix-tabpanel">
          {/* Intro Text */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your next chapter starts here—not in a database. Our AI sees your potential, not just your past. 
              No recruiter fees means employers hire on <span className="font-semibold text-foreground">merit, not cost</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="navy" className="w-full sm:w-auto" aria-label="How Jobz works for candidates">
                  <Info className="mr-2 h-4 w-4" />Learn more
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Be discovered for where you're going</DialogTitle>
                  <DialogDescription>
                    Traditional hiring rejects great candidates because recruiter fees make them "too expensive." 
                    At Jobz, employers pay £9/month—not 15-20% of your salary. You're judged on potential, not cost.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-foreground text-sm">
                  <div>
                    <p className="font-medium mb-2">How it works:</p>
                    <ol className="list-decimal pl-5 space-y-1.5">
                      <li>Create your profile and share your aspirations</li>
                      <li>AI matches you with employers who value potential</li>
                      <li>Connect directly—no recruiters filtering you out</li>
                      <li>Get hired and earn your "You're Hired" bonus</li>
                    </ol>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Why it's different:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li>No recruiter fees = no rejection due to cost</li>
                      <li>Share your "Second Chapter" goals and prove potential</li>
                      <li>Your profile stays private until you choose to connect</li>
                      <li>Earn a bonus when you land the role</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full sm:w-auto" aria-label="Open bonus calculator">
                  <Calculator className="mr-2 h-4 w-4" />Try bonus calculator
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
                <BonusCalculator
                  sampleSalary={bonusSampleSalary}
                  feePercentage={bonusFeePercentage}
                  splitPercentage={bonusSplitPercentage}
                  onSalaryChange={setBonusSampleSalary}
                  onFeeChange={(value) => setBonusFeePercentage(value[0])}
                  onSplitChange={(value) => setBonusSplitPercentage(value[0])}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={Bot}
              title="Matched on Potential, Not Keywords"
              description="Our AI sees where you're going, not just where you've been. Career changers welcome."
            />
            <FeatureCard
              icon={Coins}
              title="Get Paid When You Get Hired"
              description="Employers set 'You're Hired' bonuses. Land the role, earn the reward."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Never Rejected for Being 'Too Expensive'"
              description="No recruiter fees means employers hire on merit. Your value isn't reduced by hidden costs."
            />
            <FeatureCard
              icon={Target}
              title="No Black Holes, No Ghosting"
              description="See your status. Know where you stand. Direct communication with employers."
            />
          </div>
        </TabsContent>

        {/* CONNECTORS TAB */}
        <TabsContent value="recruiters" className="mt-8 space-y-8 radix-tabpanel">
          {/* Intro Text */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Know great people? Help them get hired. Our AI handles the matching. 
              You make the introductions. <span className="font-semibold text-foreground">Earn commission</span> when your recommendations succeed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="navy" className="w-full sm:w-auto" aria-label="What is a Connector?">
                  <Info className="mr-2 h-4 w-4" />Learn more
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Recommend talent. Earn commission.</DialogTitle>
                  <DialogDescription>
                    When roles are harder to fill, Connectors help. You bring the human connections; AI handles the matching and admin. 
                    See commission upfront, track your recommendations, and get paid when they're hired.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-foreground text-sm">
                  <div>
                    <p className="font-medium mb-2">How it works:</p>
                    <ol className="list-decimal pl-5 space-y-1.5">
                      <li>Get alerts for roles that need recommendations</li>
                      <li>Recommend candidates from your network</li>
                      <li>AI handles introductions and the process</li>
                      <li>Earn commission when your recommendation gets hired</li>
                    </ol>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Why it's different:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li>See which roles match your network</li>
                      <li>All admin handled automatically</li>
                      <li>Work when you want, from wherever you are</li>
                      <li>No caps on your earnings</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full sm:w-auto" aria-label="Open bonus calculator">
                  <Calculator className="mr-2 h-4 w-4" />Try bonus calculator
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
                <BonusCalculator
                  sampleSalary={bonusSampleSalary}
                  feePercentage={bonusFeePercentage}
                  splitPercentage={bonusSplitPercentage}
                  onSalaryChange={setBonusSampleSalary}
                  onFeeChange={(value) => setBonusFeePercentage(value[0])}
                  onSplitChange={(value) => setBonusSplitPercentage(value[0])}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={MapPin}
              title="Your Network, Your Schedule"
              description="Recommend talent when it suits you. Work from anywhere, on your terms."
            />
            <FeatureCard
              icon={HandCoins}
              title="Clear Commission, No Caps"
              description="See exactly what you'll earn upfront. No limits on your earnings."
            />
            <FeatureCard
              icon={Bot}
              title="AI Handles the Heavy Lifting"
              description="You make introductions. Our AI matches, tracks, and manages the process."
            />
            <FeatureCard
              icon={Clock}
              title="Turn Connections Into Income"
              description="Know someone perfect for a role? A quick recommendation could pay off."
            />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-primary/10 bg-card/90 backdrop-blur-md",
        "p-6 transition-all duration-300",
        "hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)] hover:border-primary/30",
        "hover:scale-[1.02] hover:bg-card/95",
        "relative overflow-hidden group"
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Icon with glow container */}
        <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
          <Icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
