
export interface VRRecommendation {
  id: number;
  recommendationDate: string;
  status?: string;
  vr: {
    id: string;
    name: string;
    vrNumber: string;
  };
}
