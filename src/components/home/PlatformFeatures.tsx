import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Coins, Bot, Calculator, User, Target, Users, Sparkles, Building2, PoundSterling } from "lucide-react";

export const PlatformFeatures = () => {
  return (
    <section className="py-20 container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">How jobz Works</h2>
      
      <Tabs defaultValue="hiring" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 bg-primary-light">
          <TabsTrigger 
            value="hiring" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            For Employers
          </TabsTrigger>
          <TabsTrigger 
            value="candidates"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            For Candidates
          </TabsTrigger>
          <TabsTrigger 
            value="recruiters"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Virtual Recruiters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hiring" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={FileText}
              title="Unlimited Job Postings"
              description="Post as many job vacancies as you need for just £29/month. No hidden fees or per-post charges."
            />
            <FeatureCard
              icon={Coins}
              title="'You're Hired' Bonus"
              description="Attract top talent by offering a bonus to successful candidates and their referrers."
            />
            <FeatureCard
              icon={Bot}
              title="AI-Powered Sourcing"
              description="Activate virtual recruiters to anonymously source and match the best candidates for your roles."
            />
            <FeatureCard
              icon={Calculator}
              title="Commission Calculator"
              description="Use our transparent calculator to see exact costs and potential savings for each hire."
            />
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-8">
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
              icon={Sparkles}
              title="Transparent Process"
              description="See exactly what bonuses are available and track your application status in real-time."
            />
          </div>
        </TabsContent>

        <TabsContent value="recruiters" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={Bot}
              title="AI-Powered Matching"
              description="Our advanced algorithms analyze job requirements and candidate profiles to create perfect matches."
            />
            <FeatureCard
              icon={Building2}
              title="Automated Sourcing"
              description="Virtual recruiters work 24/7 to identify and engage with potential candidates."
            />
            <FeatureCard
              icon={PoundSterling}
              title="Cost-Effective"
              description="Save thousands on recruitment costs with our AI-driven approach."
            />
            <FeatureCard
              icon={Target}
              title="Quality Matches"
              description="AI ensures consistent, high-quality matches based on skills, experience, and preferences."
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
    <Card className="border-none shadow-lg">
      <CardHeader>
        <Icon className="h-12 w-12 text-primary mb-4" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};