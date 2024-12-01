import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

const RecruiterSignUp = () => {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Virtual Recruiter Sign Up</CardTitle>
          </div>
          <CardDescription>
            Create an account to start recruiting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter your full name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Create a password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Recruiting Experience</Label>
            <Input id="experience" type="number" placeholder="Enter years of experience" />
          </div>
          <Button className="w-full">Sign Up</Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/recruiter/signin" className="text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterSignUp;