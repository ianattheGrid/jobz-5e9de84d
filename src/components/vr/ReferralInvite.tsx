import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ReferralInvite = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First create the referral record
      const { data: referralData, error: referralError } = await supabase
        .from("vr_referrals")
        .insert({
          candidate_email: email,
        })
        .select("referral_code")
        .single();

      if (referralError) throw referralError;

      // Get VR profile for the email
      const { data: vrProfile } = await supabase
        .from("virtual_recruiter_profiles")
        .select("full_name")
        .eq("id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      // Send the email
      const response = await fetch("/functions/v1/send-referral-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: [email],
          vrName: vrProfile?.full_name || "A Virtual Recruiter",
          referralCode: referralData.referral_code,
        }),
      });

      if (!response.ok) throw new Error("Failed to send email");

      toast({
        title: "Invitation Sent",
        description: "Your referral invitation has been sent successfully.",
      });
      
      setEmail("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Enter candidate's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Referral Invite"}
      </Button>
    </form>
  );
};