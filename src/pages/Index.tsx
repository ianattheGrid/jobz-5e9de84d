import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Building2, User, Users } from "lucide-react";

export default function Index() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-red-800">Welcome to Jobz</h1>
        <p className="text-gray-600 text-center mb-8">Choose how you want to join our platform</p>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Candidate Card */}
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <User className="h-12 w-12 text-red-800" />
              </div>
              <CardTitle>Candidate</CardTitle>
              <CardDescription>
                Find your dream job and connect with employers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link 
                to="/candidate/signin"
                className="block w-full bg-red-800 text-white text-center py-2 rounded hover:bg-red-900 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/candidate/signup"
                className="block w-full border border-red-800 text-red-800 text-center py-2 rounded hover:bg-red-50 transition-colors"
              >
                Sign Up
              </Link>
            </CardContent>
          </Card>

          {/* Employer Card */}
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Building2 className="h-12 w-12 text-red-800" />
              </div>
              <CardTitle>Employer</CardTitle>
              <CardDescription>
                Post jobs and find the perfect candidates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link 
                to="/employer/signin"
                className="block w-full bg-red-800 text-white text-center py-2 rounded hover:bg-red-900 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/employer/signup"
                className="block w-full border border-red-800 text-red-800 text-center py-2 rounded hover:bg-red-50 transition-colors"
              >
                Sign Up
              </Link>
            </CardContent>
          </Card>

          {/* Virtual Recruiter Card */}
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Users className="h-12 w-12 text-red-800" />
              </div>
              <CardTitle>Virtual Recruiter</CardTitle>
              <CardDescription>
                Help connect talent with opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link 
                to="/vr/signin"
                className="block w-full bg-red-800 text-white text-center py-2 rounded hover:bg-red-900 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/vr/signup"
                className="block w-full border border-red-800 text-red-800 text-center py-2 rounded hover:bg-red-50 transition-colors"
              >
                Sign Up
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link to="/jobs" className="text-red-800 hover:underline">
            Browse Jobs Without Signing In →
          </Link>
        </div>
      </div>
    </div>
  );
}