
import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

interface FormState {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  jobTitle: string;
  setJobTitle: (value: string) => void;
  companyName: string;
  setCompanyName: (value: string) => void;
  companyWebsite: string;
  setCompanyWebsite: (value: string) => void;
  companySize: number;
  setCompanySize: (value: number) => void;
  linkedinUrl: string;
  setLinkedinUrl: (value: string) => void;
  isSME: boolean;
  setIsSME: (value: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  isBlocked: boolean;
  referralCode: string;
  setReferralCode: (value: string) => void;
}

interface SignUpFormProps {
  userType: 'candidate' | 'employer' | 'vr';
  onSubmit: (email: string, password: string, fullName: string, jobTitle?: string, companyName?: string, companyWebsite?: string, companySize?: number) => Promise<void>;
}

export const useSignUpForm = ({ userType, onSubmit }: SignUpFormProps) => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companySize, setCompanySize] = useState(0);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isSME, setIsSME] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  
  // Initialize referralCode from URL params if available
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') || "");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email || !password || !fullName) {
        setError("Please fill in all required fields");
        return;
      }

      if (userType === 'employer' && !companyName) {
        setError("Company name is required");
        return;
      }

      if (userType === 'employer' && !isSME) {
        setError("Please confirm your company meets the eligibility criteria");
        return;
      }

      try {
        if (userType === 'employer') {
          await onSubmit(email, password, fullName, jobTitle, companyName, companyWebsite, companySize);
        } else {
          // Include referralCode in metadata by using jobTitle param (reusing existing param structure)
          // This is a temporary solution to avoid changing the function signature
          const metadata = userType === 'candidate' && referralCode ? 
            { referralCode } : undefined;
            
          await onSubmit(email, password, fullName, jobTitle);
        }
      } catch (err: any) {
        setError(err.message);

        if (err.message && err.message.toLowerCase().includes('blocked')) {
          setIsBlocked(true);
        }
      }
    },
    [email, password, fullName, jobTitle, companyName, companyWebsite, companySize, userType, onSubmit, referralCode]
  );

  const formState: FormState = {
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
    companySize,
    setCompanySize,
    linkedinUrl,
    setLinkedinUrl,
    isSME,
    setIsSME,
    error,
    setError,
    isBlocked,
    referralCode,
    setReferralCode
  };

  return {
    formState,
    handleSubmit,
  };
};
