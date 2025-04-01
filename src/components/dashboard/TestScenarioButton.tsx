
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { setupTestScenario } from "@/utils/testScenarioHelper";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const TestScenarioButton = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSetupTest = async () => {
    setIsLoading(true);
    try {
      const credentials = await setupTestScenario();
      
      toast({
        title: "Enhanced Test Scenario Created",
        description: (
          <div className="mt-2 space-y-2 text-sm">
            <p className="font-bold">Test accounts created with password: {credentials.password}</p>
            <div className="p-2 bg-gray-100 rounded">
              <p><strong>Employer:</strong> {credentials.employerEmail}</p>
              <p><strong>Direct Candidate:</strong> {credentials.candidateEmail}</p>
              <p><strong>VR Recommended Candidate:</strong> {credentials.vrCandidateEmail}</p>
              <p><strong>Virtual Recruiter:</strong> {credentials.vrEmail}</p>
            </div>
            <p>Complete workflow scenario created with:</p>
            <ul className="list-disc pl-5">
              <li>Job posting with 6% commission (£2,400)</li>
              <li>Direct application and VR recommendation</li>
              <li>Interview slots that were rejected, rescheduled, and accepted</li>
              <li>Job offer to VR candidate</li>
              <li>Commission setup (60% VR / 40% candidate)</li>
            </ul>
          </div>
        ),
        duration: 30000,
      });
    } catch (error: any) {
      console.error("Test scenario creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create test scenario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSetupTest}
      className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Enhanced Test Scenario...
        </>
      ) : (
        "Create Test Scenario"
      )}
    </Button>
  );
};
