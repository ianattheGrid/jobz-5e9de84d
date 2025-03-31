
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralRecommendationForm } from "./forms/GeneralRecommendationForm";
import { JobSpecificRecommendationForm } from "./forms/JobSpecificRecommendationForm";
import { RecommendationInfoCard } from "./RecommendationInfoCards";
import { RecommendationCheck } from "./forms/RecommendationCheck";

interface RecommendationFormsProps {
  defaultTab?: 'general' | 'job-specific';
}

export function RecommendationForms({ defaultTab = 'general' }: RecommendationFormsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Tabs defaultValue={defaultTab} className="w-full space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Submit a Recommendation</h2>
          <p className="text-gray-600">Choose the type of recommendation you want to submit:</p>
        </div>
        
        {/* Add the RecommendationCheck component at the top */}
        <RecommendationCheck />
        
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="general" 
            className="data-[state=active]:bg-[#ea384c] data-[state=active]:text-white"
          >
            General Recommendation
          </TabsTrigger>
          <TabsTrigger 
            value="job-specific"
            className="data-[state=active]:bg-[#ea384c] data-[state=active]:text-white"
          >
            Job-Specific Recommendation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <RecommendationInfoCard 
            title="About General Recommendations"
            description="Use this form to recommend a candidate for our talent pool. You will receive a commission 
            of 2.5% of the candidate's first year salary if they are hired by any employer within 6 months of your recommendation."
          />
          <GeneralRecommendationForm 
            isSubmitting={isSubmitting} 
            setIsSubmitting={setIsSubmitting} 
          />
        </TabsContent>

        <TabsContent value="job-specific">
          <RecommendationInfoCard 
            title="About Job-Specific Recommendations"
            description="Recommend a candidate for a specific job vacancy. Commission rates are set by the job 
            posting and will be displayed when you select a job. Recommendations are valid for 6 months."
          />
          <JobSpecificRecommendationForm 
            isSubmitting={isSubmitting} 
            setIsSubmitting={setIsSubmitting} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
