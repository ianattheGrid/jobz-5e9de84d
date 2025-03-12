
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { setupTestScenario } from "@/utils/testScenarioHelper";

export const TestScenarioButton = () => {
  const { toast } = useToast();

  const handleSetupTest = async () => {
    try {
      const credentials = await setupTestScenario();
      
      toast({
        title: "Test Scenario Created",
        description: (
          <div className="mt-2 space-y-2">
            <p>Test accounts created with password: {credentials.password}</p>
            <p>Employer: {credentials.employerEmail}</p>
            <p>Candidate: {credentials.candidateEmail}</p>
            <p>VR: {credentials.vrEmail}</p>
          </div>
        ),
        duration: 10000,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleSetupTest}
      className="bg-secondary hover:bg-secondary/90"
    >
      Create Test Scenario
    </Button>
  );
};
