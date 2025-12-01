
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
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="sme"
          checked={isSME}
          onCheckedChange={setIsSME}
          required
        />
        <Label htmlFor="sme" className="text-sm leading-none cursor-pointer text-white">
          This company is independently owned, not part of a larger corporate group or franchise, and has fewer than 250 employees in total.
        </Label>
      </div>
    </div>
  );
};
