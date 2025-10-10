
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { EmployerFields } from "./signup/EmployerFields";
import { CandidateFields } from "./signup/CandidateFields";
import { SignUpError } from "./signup/SignUpError";
import { CommonFields } from "./signup/CommonFields";
import { useSignUpForm } from "./signup/useSignUpForm";
import { TermsOfUse } from "./TermsOfUse";
import { useEffect, useState } from "react";

interface SignUpFormProps {
  onSubmit: (email: string, password: string, fullName: string, jobTitle?: string, companyName?: string, companyWebsite?: string, companySize?: number) => Promise<void>;
  loading: boolean;
  userType: 'candidate' | 'employer' | 'vr';
  showCompanyField?: boolean;
  hideJobTitle?: boolean;
}

export const SignUpForm = ({ 
  onSubmit, 
  loading, 
  userType, 
  showCompanyField = false,
  hideJobTitle = false 
}: SignUpFormProps) => {
  const { formState, handleSubmit } = useSignUpForm({ userType, onSubmit });
  const [searchParams] = useSearchParams();
  const [termsAgreed, setTermsAgreed] = useState(false);
  
  // Auto-fill referral code from URL params
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode && userType === 'candidate') {
      formState.setReferralCode(refCode);
    }
  }, [searchParams, userType]);

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
      <SignUpError error={formState.error} isBlocked={formState.isBlocked} />
      
      <CommonFields
        email={formState.email}
        setEmail={formState.setEmail}
        password={formState.password}
        setPassword={formState.setPassword}
        fullName={formState.fullName}
        setFullName={formState.setFullName}
        jobTitle={formState.jobTitle}
        setJobTitle={formState.setJobTitle}
        userType={userType}
        hideJobTitle={hideJobTitle}
      />

      {userType === 'employer' && (
        <EmployerFields
          companyName={formState.companyName}
          setCompanyName={formState.setCompanyName}
          companyWebsite={formState.companyWebsite}
          setCompanyWebsite={formState.setCompanyWebsite}
          isSME={formState.isSME}
          setIsSME={formState.setIsSME}
        />
      )}

      {userType === 'candidate' && (
        <>
          <CandidateFields
            linkedinUrl={formState.linkedinUrl}
            setLinkedinUrl={formState.setLinkedinUrl}
            referralCode={formState.referralCode}
            setReferralCode={formState.setReferralCode}
          />
        </>
      )}

      <TermsOfUse agreed={termsAgreed} onAgreeChange={setTermsAgreed} />

      <Button 
        className="w-full bg-[#FF69B4] hover:bg-[#FF50A8] text-white" 
        type="submit" 
        disabled={loading || !termsAgreed || (userType === 'employer' && !formState.isSME)}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to={getSignInLink()} className="text-[#FF69B4] hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
};
