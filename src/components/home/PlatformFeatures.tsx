
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Coins, Bot, Calculator, User, Target, Users, MapPin, HandCoins, ListCheck, Clock, Info } from "lucide-react";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmployeeRecruitmentCalculator } from "@/components/calculators/EmployeeRecruitmentCalculator";
import { BonusCalculator } from "@/components/candidate/sections/commission/BonusCalculator";

export const PlatformFeatures = () => {
  const [bonusSampleSalary, setBonusSampleSalary] = React.useState("");
  const [bonusFeePercentage, setBonusFeePercentage] = React.useState(7);
  const [bonusSplitPercentage, setBonusSplitPercentage] = React.useState(50);
  return (
    <section className="py-20 container mx-auto px-4">
      <h2 className={`text-3xl font-bold text-center mb-2 ${PRIMARY_COLOR_PATTERN}`}>
        How jobz Works
      </h2>
      
      <Tabs defaultValue="hiring" className="w-full max-w-4xl mx-auto">
        <TooltipProvider>
          <TabsList className="grid w-full grid-cols-3 bg-white radix-tablist">
            <TabsTrigger className="text-black radix-tab" value="hiring">
              <span className="inline-flex items-center">
                Employers
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="ml-2 h-4 w-4 text-muted-foreground" aria-label="How it works for employers" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Vetted Connectors discreetly source candidates for hard-to-fill roles. You stay in control and only pay on hire.</p>
                  </TooltipContent>
                </Tooltip>
              </span>
            </TabsTrigger>
            <TabsTrigger className="text-black radix-tab" value="candidates">
              <span className="inline-flex items-center">
                Candidates
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="ml-2 h-4 w-4 text-muted-foreground" aria-label="How it works for candidates" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Get warm intros to relevant roles via Connectors. Your details stay private until you opt in; earn a bonus when hired.</p>
                  </TooltipContent>
                </Tooltip>
              </span>
            </TabsTrigger>
            <TabsTrigger className="text-black radix-tab" value="recruiters">
              <span className="inline-flex items-center">
                Connectors
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="ml-2 h-4 w-4 text-muted-foreground" aria-label="More about Connectors" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Flexible income by introducing great candidates anonymously from your network. We handle the admin; paid on success.</p>
                  </TooltipContent>
                </Tooltip>
              </span>
            </TabsTrigger>
          </TabsList>
        </TooltipProvider>

        <TabsContent value="hiring" className="mt-8 space-y-8 radix-tabpanel">
          <div className="flex justify-start gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" aria-label="How jobz works for employers">Learn more</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Your virtual hiring team for £9/month</DialogTitle>
                  <DialogDescription>
                    Hire directly and fill multiple roles under one low‑cost subscription. Attract more applicants by setting a clear "You're Hired" bonus. For harder‑to‑fill roles, tap our connector/nomad network—no agencies, no complex software.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 text-foreground">
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Post roles and set your "You're Hired" bonus.</li>
                    <li>Hire directly and fill multiple roles for just £9/month.</li>
                    <li>Stay anonymous until you’re ready; build shortlists fast with match signals.</li>
                    <li>Activate our connector/nomad network only when vacancies are harder to fill.</li>
                  </ol>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>No agency markups or bloated software.</li>
                    <li>Transparent, pay‑on‑success costs.</li>
                    <li>Recommendations remain anonymous until both sides opt in.</li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" aria-label="Open employee recruitment cost calculator">Try cost calculator</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                <EmployeeRecruitmentCalculator />
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={FileText}
              title="Unlimited Job Postings"
              description="Post as many job vacancies as you need for just £9/month. No hidden fees."
            />
            <FeatureCard
              icon={Coins}
              title="'You're Hired' Bonus"
              description="Attract top talent by offering a bonus to successful candidates and their referrers."
            />
            <FeatureCard
              icon={Bot}
              title="AI-Powered Sourcing"
              description="Activate connectors to anonymously source and match the best candidates for your roles."
            />
            <FeatureCard
              icon={Calculator}
              title="Commission Calculator"
              description="Use our transparent calculator to see exact costs and potential savings for each hire."
            />
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="mt-8 space-y-8 radix-tabpanel">
           <div className="flex justify-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" aria-label="How jobz works for candidates">Learn more</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Be discovered. Hired faster. In control.</DialogTitle>
                  <DialogDescription>
                    Never be overlooked because of hiring costs or hidden databases. Employers find you directly. A few clicks, not a few months. Earn "You're Hired" bonuses when hired.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 text-foreground">
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Create your profile and set preferences.</li>
                    <li>Employers find and contact you directly—no walled gardens or paywalls.</li>
                    <li>Move through a streamlined process that takes a few clicks, not months.</li>
                    <li>Get feedback on outcomes; if hired, receive your "You're Hired" bonus.</li>
                  </ol>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Control your visibility and privacy.</li>
                    <li>Clear status tracking and transparent bonuses.</li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" aria-label="Open bonus calculator">Try bonus calculator</Button>
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
              icon={User}
              title="Smart Profile Matching"
              description="Create your profile once and let our AI match you with relevant opportunities that fit your skills and preferences."
            />
            <FeatureCard
              icon={Target}
              title="Earn Bonuses"
              description="Get rewarded with a 'You're Hired' bonus when you're successfully placed in a role."
            />
            <FeatureCard
              icon={Users}
              title="Referral Network"
              description="Refer friends and colleagues to jobs and share the bonus when they're hired."
            />
            <FeatureCard
              icon={Target}
              title="Transparent Process"
              description="See exactly what bonuses are available and track your application status in real-time."
            />
          </div>
        </TabsContent>

        <TabsContent value="recruiters" className="mt-8 space-y-8 radix-tabpanel">
          <div className="flex justify-end gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" aria-label="What is a Connector?">Learn more</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Recommend talent. Earn commission.</DialogTitle>
                  <DialogDescription>
                    When vacancies are harder to fill, jobz alerts Connectors to help source candidates. Recommend great people from your network and see commissions upfront.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 text-foreground">
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Get alerts for harder‑to‑fill roles.</li>
                    <li>Recommend candidates from your network with simple submissions.</li>
                    <li>Track status transparently—intros and admin handled for you.</li>
                    <li>Earn commission when your recommended candidate is hired.</li>
                  </ol>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use the calculator to see the commission on offer per role.</li>
                    <li>Flexible work from anywhere; paid on success.</li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" aria-label="Open bonus calculator">Try bonus calculator</Button>
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
              title="Work From Anywhere"
              description="Be your own boss and work flexibly from any location. All you need is a laptop and internet connection."
            />
            <FeatureCard
              icon={HandCoins}
              title="Earn Extra Income"
              description="Perfect as a second income or scale it into your primary source of earnings - you're in control of how much you make."
            />
            <FeatureCard
              icon={ListCheck}
              title="Easy Recommendations"
              description="View candidate recommendations via your dashboard and match them to live jobs or add them to our talent pool."
            />
            <FeatureCard
              icon={Clock}
              title="Flexible Schedule"
              description="Work as little or as often as you want. You decide when and how much time to dedicate."
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
    <Card className="border-none shadow-lg bg-card">
      <CardHeader>
        <Icon className="h-12 w-12 text-primary mb-4" />
        <CardTitle className={PRIMARY_COLOR_PATTERN}>{title}</CardTitle>
        <CardDescription className="text-foreground">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};
