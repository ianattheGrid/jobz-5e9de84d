import { RecommendationForms } from "@/components/recommendations/RecommendationForms";

export default function Index() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Virtual Recruiter Dashboard</h1>
      <RecommendationForms />
    </div>
  );
}