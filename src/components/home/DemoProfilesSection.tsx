import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building, Bot, ArrowRight } from "lucide-react";

export const DemoProfilesSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">See How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore demo profiles to see how candidates, employers, and virtual recruiters connect on jobz.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Candidate Demo */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Candidate Profile</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                See how job seekers showcase their skills and experience to attract the right opportunities.
              </p>
              <Link to="/demo/candidate">
                <Button className="w-full group">
                  View Demo Profile
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Employer Demo */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Building className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Employer Profile</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Discover how companies present their culture and opportunities to attract top talent.
              </p>
              <Link to="/demo/employer">
                <Button className="w-full group">
                  View Demo Profile
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Virtual Recruiter Demo */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Virtual Recruiter</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Experience how AI-powered recruiters help connect the perfect candidates with opportunities.
              </p>
              <Link to="/demo/virtual-recruiter">
                <Button className="w-full group">
                  View Demo Profile
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};