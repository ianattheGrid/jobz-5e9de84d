import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isFreeEmailProvider, emailMatchesWebsite } from "@/utils/validationUtils";
import { useIPMonitoring } from "@/hooks/useIPMonitoring";

interface UseSignUpFormProps {
  userType: 'candidate' | 'employer' | 'vr';
  onSubmit: (email: string, password: string, fullName: string, jobTitle?: string, companyName?: string, companyWebsite?: string, companySize?: number) => Promise<void>;
}

export const useSignUpForm = ({ userType, onSubmit }: UseSignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [isSME, setIsSME] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isBlocked, checkSignupAttempt } = useIPMonitoring();

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
      await onSubmit(
        email, 
        password, 
        fullName,
        jobTitle,
        companyName, 
        companyWebsite, 
        0
      );
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

  return {
    formState: {
      email,
      setEmail,
      password,
      setPassword,
      fullName,
      setFullName,
      jobTitle,
      setJobTitle,
      companyName,
      setCompanyName,
      companyWebsite,
      setCompanyWebsite,
      isSME,
      setIsSME,
      linkedinUrl,
      setLinkedinUrl,
      error,
      isBlocked
    },
    handleSubmit
  };
};
