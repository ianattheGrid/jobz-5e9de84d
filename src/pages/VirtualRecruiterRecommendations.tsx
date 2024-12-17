import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CandidateMessageForm from "@/components/vr/CandidateMessageForm";
import CandidateMessageList from "@/components/vr/CandidateMessageList";

interface Recommendation {
  id: number;
  candidate_email: string;
  candidate_phone: string | null;
  status: string;
  created_at: string;
  job_id: number | null;
}

const VirtualRecruiterRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || session.user.user_metadata.user_type !== 'vr') {
      navigate("/vr/signin");
      return;
    }

    const { data, error } = await supabase
      .from('candidate_recommendations')
      .select('*')
      .eq('vr_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load recommendations",
      });
      return;
    }

    setRecommendations(data || []);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Your Recommendations</h1>
      
      <div className="space-y-4">
        {recommendations.map((recommendation) => (
          <Card key={recommendation.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Candidate Email: {recommendation.candidate_email}</h3>
                {recommendation.candidate_phone && (
                  <p className="text-gray-600">Phone: {recommendation.candidate_phone}</p>
                )}
                <p className="text-gray-600">Status: {recommendation.status}</p>
                <p className="text-gray-600">
                  Created: {new Date(recommendation.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                onClick={() => setSelectedRecommendation(
                  selectedRecommendation === recommendation.id ? null : recommendation.id
                )}
                className="bg-[#ea384c] hover:bg-[#d32d3f] text-white"
              >
                {selectedRecommendation === recommendation.id ? "Close" : "Message Candidate"}
              </Button>
            </div>
            
            {selectedRecommendation === recommendation.id && (
              <div className="mt-4 space-y-4">
                <CandidateMessageForm
                  candidateEmail={recommendation.candidate_email}
                  recommendationId={recommendation.id}
                  onMessageSent={() => setSelectedRecommendation(null)}
                />
                <CandidateMessageList recommendationId={recommendation.id} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VirtualRecruiterRecommendations;