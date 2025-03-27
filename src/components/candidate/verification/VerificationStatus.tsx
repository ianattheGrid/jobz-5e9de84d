
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck } from "lucide-react";

type VerificationStatusProps = {
  status: string;
  serviceName: string;
};

export const VerificationStatus = ({ status, serviceName }: VerificationStatusProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {status === 'verified' ? (
          <ShieldCheck className="h-6 w-6 text-green-500" />
        ) : (
          <Shield className="h-6 w-6 text-gray-400" />
        )}
        <h2 className="text-xl font-semibold">Identity Verification</h2>
      </div>
      {status === 'verified' && (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Verified by {serviceName}
        </Badge>
      )}
      {status === 'pending' && (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Verification Pending
        </Badge>
      )}
    </div>
  );
};
