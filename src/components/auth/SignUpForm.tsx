import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignUpFormProps {
  onSubmit: (email: string, password: string, fullName: string, companyName?: string) => Promise<void>;
  loading: boolean;
  userType: 'candidate' | 'employer' | 'vr';
  showCompanyField?: boolean;
}

export const SignUpForm = ({ onSubmit, loading, userType, showCompanyField = false }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit(email, password, fullName, companyName);
    } catch (err: any) {
      const errorMessage = err.message || "";
      if (
        errorMessage.includes('already registered') || 
        errorMessage.includes('already exists') ||
        errorMessage.includes(`User already has the role ${userType}`) ||
        (err.error?.message && (
          err.error.message.includes('already registered') ||
          err.error.message.includes(`User already has the role ${userType}`)
        ))
      ) {
        setError("This email is already registered for this role. Please sign in instead.");
        // Automatically redirect to sign in page after 2 seconds
        setTimeout(() => {
          navigate(`/${userType}/signin`);
        }, 2000);
      } else {
        setError(errorMessage || "An error occurred during sign up");
      }
    }
  };

  const getSignInLink = () => {
    switch(userType) {
      case 'candidate':
        return '/candidate/signin';
      case 'employer':
        return '/employer/signin';
      case 'vr':
        return '/vr/signin';
      default:
        return '/';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input 
          id="fullName" 
          type="text" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name" 
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email" 
          required
        />
      </div>
      {showCompanyField && (
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input 
            id="companyName" 
            type="text" 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter your company name" 
            required
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password" 
          required
        />
      </div>
      <Button className="w-full bg-primary hover:bg-primary-dark text-white" type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to={getSignInLink()} className="text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
};