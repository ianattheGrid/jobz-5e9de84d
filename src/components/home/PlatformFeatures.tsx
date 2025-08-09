
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Coins, Bot, Calculator, User, Target, Users, MapPin, HandCoins, ListCheck, Clock } from "lucide-react";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

export const PlatformFeatures = () => {
  return (
    <section className="py-20 container mx-auto px-4">
      <h2 className={`text-3xl font-bold text-center mb-2 ${PRIMARY_COLOR_PATTERN}`}>
        How jobz Works
      </h2>
      
      <Tabs defaultValue="hiring" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 bg-white radix-tablist">
          <TabsTrigger className="text-black radix-tab" value="hiring">
            Employers
          </TabsTrigger>
          <TabsTrigger className="text-black radix-tab" value="candidates">
            Candidates
          </TabsTrigger>
          <TabsTrigger className="text-black radix-tab" value="recruiters">
            Connectors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hiring" className="mt-8 space-y-8 radix-tabpanel">
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
