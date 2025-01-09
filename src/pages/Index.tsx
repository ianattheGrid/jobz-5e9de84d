import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Building2, User, Users, Calculator, Sparkles, PoundSterling, FileText, Target, Bot, Coins } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          alt="Abstract digital connections representing AI networking"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI-Powered Hiring, Reimagined
            </h1>
            <p className="text-xl mb-8">
              Combining AI technology with human connections to revolutionize recruitment. 
              Post jobs, find talent, and reward successful matches.
            </p>
            <div className="flex gap-4">
              <Link 
                to="/employer/signup"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium"
              >
                Start Hiring
              </Link>
              <Link 
                to="/candidate/signup"
                className="bg-white hover:bg-gray-100 text-primary px-6 py-3 rounded-lg font-medium"
              >
                Find Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview Section */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How jobz Works</h2>
        
        <Tabs defaultValue="hiring" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hiring">For Employers</TabsTrigger>
            <TabsTrigger value="candidates">For Candidates</TabsTrigger>
            <TabsTrigger value="recruiters">Virtual Recruiters</TabsTrigger>
          </TabsList>

          {/* Hiring Companies Tab */}
          <TabsContent value="hiring" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <FileText className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Unlimited Job Postings</CardTitle>
                  <CardDescription>
                    Post as many job vacancies as you need for just £29/month. No hidden fees or per-post charges.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <Coins className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>"You're Hired" Bonus</CardTitle>
                  <CardDescription>
                    Attract top talent by offering a bonus to successful candidates and their referrers.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <Bot className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>AI-Powered Sourcing</CardTitle>
                  <CardDescription>
                    Activate virtual recruiters to anonymously source and match the best candidates for your roles.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <Calculator className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Commission Calculator</CardTitle>
                  <CardDescription>
                    Use our transparent calculator to see exact costs and potential savings for each hire.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <User className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Smart Profile Matching</CardTitle>
                  <CardDescription>
                    Create your profile once and let our AI match you with relevant opportunities that fit your skills and preferences.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <Target className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Earn Bonuses</CardTitle>
                  <CardDescription>
                    Get rewarded with a "You're Hired" bonus when you're successfully placed in a role.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Referral Network</CardTitle>
                  <CardDescription>
                    Refer friends and colleagues to jobs and share the bonus when they're hired.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <Sparkles className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Transparent Process</CardTitle>
                  <CardDescription>
                    See exactly what bonuses are available and track your application status in real-time.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          {/* Virtual Recruiters Tab */}
          <TabsContent value="recruiters" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <Bot className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>AI-Powered Matching</CardTitle>
                  <CardDescription>
                    Our advanced algorithms analyze job requirements and candidate profiles to create perfect matches.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <Building2 className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Automated Sourcing</CardTitle>
                  <CardDescription>
                    Virtual recruiters work 24/7 to identify and engage with potential candidates.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <PoundSterling className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Cost-Effective</CardTitle>
                  <CardDescription>
                    Save thousands on recruitment costs with our AI-driven approach.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <Target className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Quality Matches</CardTitle>
                  <CardDescription>
                    AI ensures consistent, high-quality matches based on skills, experience, and preferences.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Sign Up Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get Started Today</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Candidate Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Candidate</CardTitle>
                <CardDescription>
                  Never be rejected due to cost. Earn "You're Hired" bonuses while finding your perfect role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link 
                  to="/candidate/signin"
                  className="block w-full bg-primary text-white text-center py-2 rounded hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/candidate/signup"
                  className="block w-full border border-primary text-primary text-center py-2 rounded hover:bg-primary/5 transition-colors"
                >
                  Sign Up
                </Link>
              </CardContent>
            </Card>

            {/* Employer Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Building2 className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Employer</CardTitle>
                <CardDescription>
                  Save thousands on recruitment costs with our revolutionary sourcing platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link 
                  to="/employer/signin"
                  className="block w-full bg-primary text-white text-center py-2 rounded hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/employer/signup"
                  className="block w-full border border-primary text-primary text-center py-2 rounded hover:bg-primary/5 transition-colors"
                >
                  Sign Up
                </Link>
              </CardContent>
            </Card>

            {/* Virtual Recruiter Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Virtual Recruiter</CardTitle>
                <CardDescription>
                  Create a flexible income stream from anywhere - perfect as your main or second income
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link 
                  to="/vr/signin"
                  className="block w-full bg-primary text-white text-center py-2 rounded hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/vr/signup"
                  className="block w-full border border-primary text-primary text-center py-2 rounded hover:bg-primary/5 transition-colors"
                >
                  Sign Up
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Link to="/jobs" className="text-primary hover:underline">
              Browse Jobs Without Signing In →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
