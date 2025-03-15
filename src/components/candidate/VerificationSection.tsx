
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const VerificationSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>('unverified');

  const startVerification = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to verify your identity",
          variant: "destructive"
        });
        return;
      }

      // For now, just show the coming soon message without database interaction
      // We'll implement the database part after types are updated
      toast({
        title: "Coming Soon",
        description: "Identity verification will be available soon!"
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to start verification process",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {verificationStatus === 'verified' ? (
            <ShieldCheck className="h-6 w-6 text-green-500" />
          ) : (
            <Shield className="h-6 w-6 text-gray-400" />
          )}
          <h2 className="text-xl font-semibold">Identity Verification</h2>
        </div>
        {verificationStatus === 'verified' && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Verified
          </Badge>
        )}
      </div>
      
      <p className="text-gray-600 mb-4">
        Verify your identity to increase your credibility with potential employers. 
        This is optional but recommended.
      </p>
      
      {verificationStatus !== 'verified' && (
        <Button
          onClick={startVerification}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Starting Verification..." : "Start Verification"}
        </Button>
      )}
    </div>
  );
};
