import { CoreReferenceEntry } from "@/integrations/supabase/types/profiles";
import { VouchBlock } from "../shared/VouchBlock";

interface CoreRecommendationsBlockProps {
  recommendations: CoreReferenceEntry[];
  onChange: (recommendations: CoreReferenceEntry[]) => void;
}

export function CoreRecommendationsBlock(props: CoreRecommendationsBlockProps) {
  return <VouchBlock {...props} />;
}
