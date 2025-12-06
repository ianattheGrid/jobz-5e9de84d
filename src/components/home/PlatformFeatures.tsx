
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
                Many SMEs end up paying for LinkedIn Recruiter, agency fees, and per‑hire costs that were never designed with them in mind. <span className="font-semibold text-foreground">Jobz is.</span> For <span className="font-semibold text-foreground">£9/month</span>, you get unlimited job posts, direct access to a live candidate database, and <span className="font-semibold text-foreground">Webby—your AI co‑pilot</span>—for smarter, faster hiring, with no tie‑ins and no per‑hire fees.
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
              title="Post Unlimited. Search Unlimited."
              description="Create as many roles as you like and browse a live, swipe‑style candidate database in a few taps—no limits on how much you can use the platform."
            />
            <FeatureCard
              icon={Bot}
              title="Webby, Your Hiring Co‑Pilot."
              description="Use AI to cut through the noise. Webby spots career‑changers, second‑chapter candidates, and 'non‑obvious' matches that job boards and keyword searches overlook."
            />
            <FeatureCard
              icon={Users}
              title="Bonuses & Connectors When You Need Them."
              description="Add optional 'You're Hired' bonuses to make key roles stand out, and switch on our anonymous Connector network to reach talent your usual channels never touch."
            />
            <FeatureCard
              icon={Workflow}
              title="Direct, Human Hiring. On Your Terms."
              description="Talk straight to candidates, keep things anonymous until there's a real fit, and move from first contact to start date without agencies slowing everything down."
            />
          </div>
        </TabsContent>

        {/* CANDIDATES TAB */}
        <TabsContent value="candidates" className="mt-8 space-y-8 radix-tabpanel">
          {/* Intro Text */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-lg text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Hiring shouldn't be a barrier to opportunity.</span> The average cost to hire an employee is <span className="font-semibold text-foreground">£6,125</span>, creating huge barriers for SMEs. Jobz changes the game: companies pay just <span className="font-semibold text-foreground">£9/month</span>, making hiring simple and opening up opportunities for you across all sectors. Here, you're not just a number, and progression is often faster in growing businesses.
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
        // Base: gradient background with depth
        "relative rounded-2xl p-6 overflow-hidden group cursor-pointer",
        "bg-gradient-to-br from-slate-50 via-white to-slate-100/50",
        "dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        // Prominent border
        "border-2 border-primary/20",
        // Strong shadow for depth
        "shadow-lg shadow-primary/5",
        // Hover effects
        "transition-all duration-500 ease-out",
        "hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/20",
        "hover:border-primary/40"
      )}
    >
      {/* Animated gradient shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      {/* Corner accent glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Large glowing icon container */}
        <div className="mb-5 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 shadow-[0_0_20px_hsl(var(--primary)/0.2)] group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] group-hover:scale-110 transition-all duration-300">
          <Icon className="h-8 w-8 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
