
import { Checkbox } from "@/components/ui/checkbox";

interface PaymentTermsCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const PaymentTermsCheckbox = ({ 
  checked, 
  onCheckedChange 
}: PaymentTermsCheckboxProps) => {
  return (
    <div className="flex items-start space-x-2 pt-2">
      <Checkbox 
        id="terms" 
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)} 
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none cursor-pointer"
        >
          Payment Terms
        </label>
        <p className="text-sm text-muted-foreground">
          I agree to pay the total amount within 30 days of the candidate's start date. 
          I understand that bonuses will be distributed after payment is received.
        </p>
      </div>
    </div>
  );
};
