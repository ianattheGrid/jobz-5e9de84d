
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";
import NavBar from "@/components/NavBar";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";
import { useState } from "react";

const VirtualRecruiterSignUp = () => {
  const { signUp, loading } = useSignUp();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (email: string, password: string, fullName: string) => {
    setError(null);
    try {
      console.log("Starting VR signup with:", { email, fullName });
      await signUp(email, password, 'vr', fullName);
    } catch (err: any) {
      console.error("VR signup error:", err);
      setError(err.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-md mx-auto">
          <h1 className={`text-2xl font-bold text-center mb-8 text-white ${PRIMARY_COLOR_PATTERN}`}>
            Sign Up as Virtual Recruiter
          </h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <SignUpForm 
              onSubmit={handleSubmit} 
              loading={loading} 
              userType="vr"
              showCompanyField={false} 
              hideJobTitle={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualRecruiterSignUp;
