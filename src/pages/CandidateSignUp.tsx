import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound } from "lucide-react";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReferralDetails {
  vrName: string;
}

const CandidateSignUp = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const referralCode = searchParams.get("ref");
  const [referralDetails, setReferralDetails] = useState<ReferralDetails | null>(null);
  const { handleSignUp, loading } = useSignUp();

  useEffect(() => {
    const validateReferralCode = async () => {
      if (!referralCode) return;

      const { data, error } = await supabase
        .from("vr_referrals")
        .select(`
          vr_id,
          virtual_recruiter_profiles (
            full_name
          )
        `)
        .eq("referral_code", referralCode)
        .eq("status", "pending")
        .single();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Invalid Referral Code",
          description: "This referral link is no longer valid.",
        });
        return;
      }

      setReferralDetails({
        vrName: data.virtual_recruiter_profiles?.full_name || "Virtual Recruiter",
      });
    };

    validateReferralCode();
  }, [referralCode, toast]);

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <UserRound className="h-8 w-8 text-red-800" />
            <CardTitle className="text-2xl">Candidate Sign Up</CardTitle>
          </div>
          <CardDescription>
            {referralDetails 
              ? `Create your account - Recommended by ${referralDetails.vrName}`
              : "Create a candidate account to apply for jobs"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm onSubmit={handleSignUp} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateSignUp;