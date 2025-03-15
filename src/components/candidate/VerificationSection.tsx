
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const VerificationSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>('unverified');

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('candidate_verifications')
        .select('verification_status')
        .eq('candidate_id', session.user.id)
        .single();

      if (error) throw error;
      if (data) {
        setVerificationStatus(data.verification_status);
      }
    } catch (error) {
      console.error('Error loading verification status:', error);
    }
  };

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

      const { error } = await supabase
        .from('candidate_verifications')
        .insert({
          candidate_id: session.user.id,
          verification_status: 'pending'
        });

      if (error) throw error;

      setVerificationStatus('pending');
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
