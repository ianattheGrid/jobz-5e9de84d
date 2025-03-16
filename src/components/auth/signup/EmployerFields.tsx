
import { FormField } from "./FormFields";
import { SMEVerification } from "./SMEVerification";

interface EmployerFieldsProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  companyWebsite: string;
  setCompanyWebsite: (value: string) => void;
  companySize: string;
  setCompanySize: (value: string) => void;
  isSME: boolean;
  setIsSME: (value: boolean) => void;
}

export const EmployerFields = ({
  companyName,
  setCompanyName,
  companyWebsite,
  setCompanyWebsite,
  companySize,
  setCompanySize,
  isSME,
  setIsSME,
}: EmployerFieldsProps) => (
  <>
    <FormField
      id="companyName"
      label="Company Name"
      value={companyName}
      onChange={(e) => setCompanyName(e.target.value)}
      placeholder="Enter your company name"
      required
    />
    <FormField
      id="companyWebsite"
      label="Company Website"
      value={companyWebsite}
      onChange={(e) => setCompanyWebsite(e.target.value)}
      placeholder="https://www.company.com"
      type="url"
      required
    />
    <SMEVerification
      companySize={companySize}
      setCompanySize={setCompanySize}
      isSME={isSME}
      setIsSME={setIsSME}
    />
  </>
);
