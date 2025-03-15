
import { FormField } from "./FormFields";

interface CandidateFieldsProps {
  linkedinUrl: string;
  setLinkedinUrl: (value: string) => void;
}

export const CandidateFields = ({
  linkedinUrl,
  setLinkedinUrl,
}: CandidateFieldsProps) => (
  <FormField
    id="linkedinUrl"
    label="LinkedIn Profile URL (Optional)"
    value={linkedinUrl}
    onChange={(e) => setLinkedinUrl(e.target.value)}
    placeholder="https://www.linkedin.com/in/your-profile"
    type="url"
  />
);

