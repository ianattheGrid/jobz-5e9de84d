import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Referral {
  id: number;
  candidate_email: string;
  status: string;
  created_at: string;
  signed_up_at: string | null;
}

export const ReferralsList = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    const loadReferrals = async () => {
      const { data } = await supabase
        .from("vr_referrals")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setReferrals(data);
      }
    };

    loadReferrals();

    // Subscribe to changes
    const channel = supabase
      .channel("referrals_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "vr_referrals",
        },
        () => {
          loadReferrals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Referrals</h2>
      {referrals.map((referral) => (
        <Card key={referral.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{referral.candidate_email}</p>
              <p className="text-sm text-gray-500">
                Referred on: {new Date(referral.created_at).toLocaleDateString()}
              </p>
              {referral.signed_up_at && (
                <p className="text-sm text-gray-500">
                  Signed up: {new Date(referral.signed_up_at).toLocaleDateString()}
                </p>
              )}
            </div>
            <Badge
              variant={referral.status === "completed" ? "default" : "secondary"}
            >
              {referral.status}
            </Badge>
          </div>
        </Card>
      ))}
      {referrals.length === 0 && (
        <p className="text-gray-500">No referrals yet</p>
      )}
    </div>
  );
};