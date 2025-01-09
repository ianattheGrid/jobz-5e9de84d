import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Building2, User, Users, Calculator, Sparkles, PoundSterling } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1500673922987-e212871fec22"
          alt="Abstract lights representing connections"
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

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose jobz?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <PoundSterling className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Affordable Hiring</CardTitle>
              <CardDescription>
                Just £29/month for unlimited job postings. Save thousands on recruitment costs.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-none shadow-lg">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <CardTitle>AI-Powered Matching</CardTitle>
              <CardDescription>
                Our smart algorithms connect you with the perfect candidates or jobs.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-none shadow-lg">
            <CardHeader>
              <Calculator className="h-12 w-12 text-primary mb-4" />
              <CardTitle>"You're Hired" Bonus</CardTitle>
              <CardDescription>
                Unique bonus scheme that rewards successful placements.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
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