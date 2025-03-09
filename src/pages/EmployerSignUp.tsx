
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";
import NavBar from "@/components/NavBar";

const EmployerSignUp = () => {
  const { signUp, loading } = useSignUp();

  const handleSubmit = async (email: string, password: string, fullName: string, companyName: string) => {
    await signUp(email, password, 'employer', fullName, companyName);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8 text-[#D946EF]">Sign Up as Employer</h1>
          <div className="bg-card rounded-lg shadow-lg p-6">
            <SignUpForm 
              onSubmit={handleSubmit} 
              loading={loading} 
              userType="employer"
              showCompanyField={true} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignUp;
