import { CoreReferenceEntry } from "@/integrations/supabase/types/profiles";
import { VouchBlock } from "../shared/VouchBlock";

interface PivotRecommendationsBlockProps {
  recommendations: CoreReferenceEntry[];
  onChange: (recommendations: CoreReferenceEntry[]) => void;
}

export function PivotRecommendationsBlock(props: PivotRecommendationsBlockProps) {
  return <VouchBlock {...props} />;
}
