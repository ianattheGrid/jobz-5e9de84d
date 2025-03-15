import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { isFreeEmailProvider, emailMatchesWebsite } from "@/utils/validationUtils";
import { useIPMonitoring } from "@/hooks/useIPMonitoring";
import { FormField } from "./signup/FormFields";
import { EmployerFields } from "./signup/EmployerFields";
import { CandidateFields } from "./signup/CandidateFields";
import { SignUpError } from "./signup/SignUpError";

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
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isBlocked, checkSignupAttempt } = useIPMonitoring();

  const validateEmployerSignup = () => {
    if (isFreeEmailProvider(email)) {
      setError("Please use your work email address. Personal email providers are not allowed for employer accounts.");
      return false;
    }

    if (!companyWebsite) {
      setError("Company website is required for employer registration.");
      return false;
    }

    try {
      new URL(companyWebsite);
    } catch {
      setError("Please enter a valid company website URL.");
      return false;
    }

    if (!emailMatchesWebsite(email, companyWebsite)) {
      setError("Your email domain must match your company's website domain.");
      return false;
    }

    return true;
  };

  const validateCandidateSignup = () => {
    if (linkedinUrl) {
      try {
        const url = new URL(linkedinUrl);
        if (!url.hostname.includes('linkedin.com')) {
          setError("Please enter a valid LinkedIn profile URL");
          return false;
        }
      } catch {
        setError("Please enter a valid LinkedIn profile URL");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const canProceed = await checkSignupAttempt(email);
    if (!canProceed) {
      setError("Too many signup attempts from this IP address. Please try again later.");
      return;
    }

    if (userType === 'employer' && !validateEmployerSignup()) {
      return;
    }

    if (userType === 'candidate' && !validateCandidateSignup()) {
      return;
    }

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
      <SignUpError error={error} isBlocked={isBlocked} />
      
      <FormField
        id="fullName"
        label="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Enter your full name"
        required
      />

      <FormField
        id="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={userType === 'employer' ? "Enter your work email" : "Enter your email"}
        type="email"
        required
      />

      {userType === 'employer' && (
        <EmployerFields
          companyName={companyName}
          setCompanyName={setCompanyName}
          companyWebsite={companyWebsite}
          setCompanyWebsite={setCompanyWebsite}
        />
      )}

      {userType === 'candidate' && (
        <CandidateFields
          linkedinUrl={linkedinUrl}
          setLinkedinUrl={setLinkedinUrl}
        />
      )}

      <FormField
        id="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a password"
        type="password"
        required
      />

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
