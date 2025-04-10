
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";
import { Building2, User, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ContractorRecruitmentSection = () => {
  const [isInterested, setIsInterested] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const saveFeedback = async (interested: boolean, type?: string) => {
    try {
      const { error } = await (supabase.from as any)('contractor_recruitment_feedback').insert({ 
        is_interested: interested, 
        user_type: type 
      });

      if (error) throw error;

      toast.success("Thank you for your feedback!");
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast.error("There was an issue saving your feedback. Please try again.");
    }
  };

  const handleInterestResponse = (interested: boolean) => {
    setIsInterested(interested);
    saveFeedback(interested);
    
    if (!interested) {
      setSubmitted(true);
    }
  };

  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
    saveFeedback(true, type);
    setSubmitted(true);
  };

  const resetForm = () => {
    setIsInterested(null);
    setUserType(null);
    setSubmitted(false);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className={`text-3xl font-bold mb-4 ${PRIMARY_COLOR_PATTERN}`}>
              Coming Soon: Fixed-Fee Contractor Recruitment
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              We're planning to disrupt the UK contractor recruitment market with a revolutionary fixed-fee service.
              Our platform will connect companies directly with contractors, automating IR35 compliance, 
              payment processing, and contract management—all for a transparent monthly fee of just £100.
              No more percentage-based markups or hidden costs.
            </p>
          </div>

          <Card className="border shadow-lg bg-white">
            <CardHeader className="text-center">
              <CardTitle className={`text-xl font-semibold ${PRIMARY_COLOR_PATTERN}`}>
                We'd Love Your Feedback
              </CardTitle>
              <CardDescription className="text-gray-600">
                Would this service be of interest to you?
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!submitted ? (
                <div className="space-y-6">
                  {isInterested === null ? (
                    <div className="flex justify-center gap-4">
                      <Button 
                        onClick={() => handleInterestResponse(true)}
                        className="bg-white text-gray-900 border-2 border-gray-200 hover:bg-primary hover:text-white hover:border-primary"
                      >
                        Yes
                      </Button>
                      <Button 
                        onClick={() => handleInterestResponse(false)}
                        className="bg-white text-gray-900 border-2 border-gray-200 hover:bg-primary hover:text-white hover:border-primary"
                      >
                        No
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-center font-medium text-gray-800">Are you an employer or a contractor?</p>
                      <div className="flex justify-center gap-4">
                        <Button
                          onClick={() => handleUserTypeSelection('employer')}
                          className="flex flex-col items-center gap-2 p-6 bg-white text-gray-900 border-2 border-gray-200 hover:border-primary hover:bg-white"
                        >
                          <Building2 className="h-8 w-8 text-primary" />
                          <span>Employer</span>
                        </Button>
                        <Button
                          onClick={() => handleUserTypeSelection('contractor')}
                          className="flex flex-col items-center gap-2 p-6 bg-white text-gray-900 border-2 border-gray-200 hover:border-primary hover:bg-white"
                        >
                          <User className="h-8 w-8 text-primary" />
                          <span>Contractor</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-lg font-medium text-gray-800 mb-4">
                    Thank you for your feedback!
                  </p>
                  <p className="text-gray-600 mb-6">
                    {isInterested 
                      ? `We'll keep you updated on our ${userType === 'employer' ? 'employer' : 'contractor'} services.`
                      : "We appreciate your response and will continue improving our offerings."}
                  </p>
                  <Button
                    onClick={resetForm}
                    className="bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white"
                  >
                    Back to Survey
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
