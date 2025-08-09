
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchRecommendationStatus, RecommendationStatus } from "@/utils/auth/fetchRecommendationStatus";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle, Info, UserCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function RecommendationCheck() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<RecommendationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const recommendationStatus = await fetchRecommendationStatus(email);
      setStatus(recommendationStatus);
      
      // Show a toast notification if the candidate is already registered
      if (recommendationStatus.isRegistered) {
        toast({
          title: "Candidate already registered",
          description: "This candidate has already created an account on the platform.",
          variant: "default",
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to check recommendation status");
    } finally {
      setLoading(false);
    }
  };

  const renderStatusMessage = () => {
    if (!status) return null;

    // If the candidate is already registered
    if (status.isRegistered) {
      return (
        <Alert className="bg-blue-50 border-blue-200">
          <UserCheck className="h-5 w-5 text-blue-600" />
          <AlertTitle>Candidate already registered</AlertTitle>
          <AlertDescription>
            This candidate has already created an account on the platform. 
            {status.exists && !status.isExpired 
              ? " They were recommended by " + (status.recommendedBy || "another Virtual Recruiter") + 
                " on " + (status.recommendationDate ? format(new Date(status.recommendationDate), "PPP") : "an unknown date") + "."
              : " They have not been recommended yet or their recommendation has expired."}
          </AlertDescription>
        </Alert>
      );
    }

    if (!status.exists) {
      return (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle>Candidate is available</AlertTitle>
          <AlertDescription>
            This candidate hasn't been recommended yet. You can proceed with your recommendation.
          </AlertDescription>
        </Alert>
      );
    }

    if (status.isExpired) {
      return (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertTitle>Previous recommendation expired</AlertTitle>
          <AlertDescription>
            This candidate was previously recommended by {status.recommendedBy || "another Connector"} on {status.recommendationDate ? format(new Date(status.recommendationDate), "PPP") : "an unknown date"}, but the 6-month recommendation period has expired. You can submit a new recommendation.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertTitle>Candidate already recommended</AlertTitle>
        <AlertDescription>
          This candidate was recently recommended by {status.recommendedBy || "another Connector"} on {status.recommendationDate ? format(new Date(status.recommendationDate), "PPP") : "an unknown date"}. Recommendations are valid for 6 months.
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-4 mb-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Check if a candidate is already recommended</h3>
        <form onSubmit={handleCheck} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter candidate email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-[#ea384c] hover:bg-[#d32d3f] text-white"
          >
            {loading ? "Checking..." : "Check"}
          </Button>
        </form>
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
      
      {renderStatusMessage()}
    </div>
  );
}
