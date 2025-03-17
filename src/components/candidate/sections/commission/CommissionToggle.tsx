
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";

interface CommissionToggleProps {
  control: Control<any>;
  name: string;
  label: string;
  onChange?: (checked: boolean) => void;
}

const CommissionToggle = ({ control, name, label, onChange }: CommissionToggleProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 bg-white commission-toggle-container">
            <div>
              <FormLabel className="text-sm text-gray-900">{label}</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  onChange?.(checked);
                }}
              />
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );
};

export default CommissionToggle;
