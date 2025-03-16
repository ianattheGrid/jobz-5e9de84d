
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface SMEVerificationProps {
  companySize: string;
  setCompanySize: (value: string) => void;
  isSME: boolean;
  setIsSME: (checked: boolean) => void;
}

export const SMEVerification = ({
  companySize,
  setCompanySize,
  isSME,
  setIsSME
}: SMEVerificationProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companySize">Number of Employees</Label>
        <Input
          id="companySize"
          type="number"
          value={companySize}
          onChange={(e) => setCompanySize(e.target.value)}
          placeholder="Enter number of employees"
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="sme"
          checked={isSME}
          onCheckedChange={setIsSME}
          required
        />
        <Label htmlFor="sme" className="text-sm leading-none">
          I confirm that my company has 499 employees or fewer
        </Label>
      </div>
    </div>
  );
};
