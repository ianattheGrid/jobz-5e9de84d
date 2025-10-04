
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SMEVerificationProps {
  isSME: boolean;
  setIsSME: (checked: boolean) => void;
}

export const SMEVerification = ({
  isSME,
  setIsSME
}: SMEVerificationProps) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Jobz is exclusively for Small and Medium-sized Enterprises (SMEs) with 499 employees or fewer. This allows us to better serve the unique needs of growing businesses.
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
