import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Link2, MessageCircle } from "lucide-react";

export const ReferralInvite = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const { toast } = useToast();

  // Helper function to generate a referral code
  const generateReferralCode = async () => {
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `REF-${randomStr}`;
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) {
        throw new Error("Not authenticated");
      }

      // First create the referral record
      const { data: referralData, error: referralError } = await supabase
        .from("vr_referrals")
        .insert({
          candidate_email: email,
          vr_id: user.data.user.id,
          status: "pending",
          referral_code: await generateReferralCode() // Generate a code client-side
        })
        .select()
        .single();

      if (referralError) throw referralError;

      // Get VR profile for the email
      const { data: vrProfile } = await supabase
        .from("virtual_recruiter_profiles")
        .select("full_name")
        .eq("id", user.data.user.id)
        .single();

      // Send the email via the edge function
      const { error: emailError } = await supabase.functions.invoke("send-referral-email", {
        body: {
          to: [email],
          vrName: vrProfile?.full_name || "A Connector",
          referralCode: referralData.referral_code,
        },
      });

      if (emailError) throw new Error("We saved the referral but could not send the email. Please try again.");

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

  /** Creates a one-off invite link the Connector can paste anywhere. */
  const createShareLink = async () => {
    setLinkLoading(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) throw new Error("Not authenticated");

      const code = await generateReferralCode();
      const { data, error } = await supabase
        .from("vr_referrals")
        .insert({
          candidate_email: `link-${code.toLowerCase()}@invite.jobz`,
          vr_id: user.data.user.id,
          status: "pending",
          referral_code: code,
        })
        .select()
        .single();

      if (error) throw error;

      setShareLink(`${window.location.origin}/candidate/signup?ref=${data.referral_code}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Couldn't create a link",
        description: error.message,
      });
    } finally {
      setLinkLoading(false);
    }
  };

  const copyLink = async () => {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    toast({ title: "Link copied", description: "Paste it wherever you like." });
  };

  const whatsappHref = shareLink
    ? `https://wa.me/?text=${encodeURIComponent(
        `Join Jobz and get found by Bristol employers directly — no agency in the middle: ${shareLink}`,
      )}`
    : "#";

  return (
    <div className="space-y-6">
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

      <div className="border-t pt-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          Haven't got their email? Make a link instead and send it however you like.
        </p>

        {!shareLink ? (
          <Button type="button" variant="outline" onClick={createShareLink} disabled={linkLoading} className="gap-2">
            <Link2 className="h-4 w-4" />
            {linkLoading ? "Creating..." : "Create an invite link"}
          </Button>
        ) : (
          <div className="space-y-3">
            <Input readOnly value={shareLink} onFocus={(e) => e.currentTarget.select()} />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={copyLink} className="gap-2">
                <Copy className="h-4 w-4" /> Copy link
              </Button>
              <Button asChild type="button" variant="outline" className="gap-2">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" /> Share on WhatsApp
                </a>
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShareLink(null)}>
                New link
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
