
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Coins, Bot, Calculator, User, Target, Users, MapPin, HandCoins, ListCheck, Clock, Info } from "lucide-react";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const PlatformFeatures = () => {
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
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" aria-label="How jobz works for employers">Learn more</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>How jobz works for Employers</DialogTitle>
                  <DialogDescription>
                    Control the process while expanding your reach for hard-to-fill roles. Pay only when a hire starts.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 text-foreground">
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Post a role and set your “You’re Hired” bonus.</li>
                    <li>Connectors anonymously source and recommend candidates from trusted networks.</li>
                    <li>Review recommendations and request intros when you’re interested.</li>
                    <li>Hire with confidence; bonuses are released on successful start.</li>
                  </ol>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>We vet and manage all Connectors.</li>
                    <li>Recommendations remain anonymous until both sides opt in.</li>
                    <li>Transparent, performance-based cost.</li>
                  </ul>
                </div>
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
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" aria-label="How jobz works for candidates">Learn more</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>How jobz works for Candidates</DialogTitle>
                  <DialogDescription>
                    Get warm introductions to roles that fit you—your privacy first, and earn a bonus on hire.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 text-foreground">
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Create your profile and set preferences.</li>
                    <li>Connectors share relevant opportunities without exposing your identity.</li>
                    <li>Opt in when you want an introduction; proceed to interview.</li>
                    <li>If hired, you receive your “You’re Hired” bonus.</li>
                  </ol>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your details stay private until you opt in.</li>
                    <li>Opportunities beyond job boards via trusted networks.</li>
                    <li>Clear status tracking and transparent bonuses.</li>
                  </ul>
                </div>
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
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" aria-label="What is a Connector?">Learn more</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>What is a Connector?</DialogTitle>
                  <DialogDescription>
                    Vetted individuals who anonymously introduce quality candidates from their networks—paid on successful hires.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 text-foreground">
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Browse open roles and the talent pool.</li>
                    <li>Recommend candidates anonymously with context.</li>
                    <li>We handle intros and admin; you stay anonymous by default.</li>
                    <li>Earn your commission when a recommended candidate is hired.</li>
                  </ol>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Work from anywhere, choose your effort.</li>
                    <li>We vet, verify, and monitor performance.</li>
                    <li>Transparent commissions, paid on success.</li>
                  </ul>
                </div>
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
