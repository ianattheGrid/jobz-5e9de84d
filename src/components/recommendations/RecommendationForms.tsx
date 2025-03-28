
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralRecommendationForm } from "./forms/GeneralRecommendationForm";
import { JobSpecificRecommendationForm } from "./forms/JobSpecificRecommendationForm";
import { RecommendationInfoCard } from "./RecommendationInfoCards";

export function RecommendationForms() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Tabs defaultValue="general" className="w-full space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Submit a Recommendation</h2>
          <p className="text-gray-600">Choose the type of recommendation you want to submit:</p>
        </div>
        
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
            of 2.5% of the candidate's first year salary if they are hired by any employer."
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
            posting and will be displayed when you select a job."
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
