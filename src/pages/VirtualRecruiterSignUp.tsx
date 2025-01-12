import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";

const VirtualRecruiterSignUp = () => {
  const { signUp, loading } = useSignUp();

  const handleSubmit = async (email: string, password: string, fullName: string) => {
    await signUp(email, password, 'vr', fullName, '');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Sign Up as Virtual Recruiter</h1>
        <SignUpForm 
          onSubmit={handleSubmit} 
          loading={loading} 
          userType="vr"
          showCompanyField={false} 
        />
      </div>
    </div>
  );
};

export default VirtualRecruiterSignUp;