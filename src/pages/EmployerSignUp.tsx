import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";
import NavBar from "@/components/NavBar";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

const EmployerSignUp = () => {
  const { signUp, loading } = useSignUp();

  const handleSubmit = async (
    email: string, 
    password: string, 
    fullName: string,
    jobTitle?: string,
    companyName?: string, 
    companyWebsite?: string,
    companySize?: number
  ) => {
    await signUp(
      email, 
      password, 
      'employer', 
      fullName, 
      companyName || '', 
      companyWebsite || '',
      companySize || 0
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-md mx-auto">
          <h1 className={`text-2xl font-bold text-center mb-8 text-white ${PRIMARY_COLOR_PATTERN}`}>
            Sign Up as Employer
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
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
