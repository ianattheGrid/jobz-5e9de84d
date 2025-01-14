import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";

interface CommissionToggleProps {
  control: Control<any>;
  name: string;
  label: string;
  onChange?: (checked: boolean) => void;
  defaultValue?: boolean;
}

const CommissionToggle = ({ control, name, label, onChange, defaultValue = false }: CommissionToggleProps) => {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 bg-card">
            <div>
              <FormLabel className="text-sm text-foreground">{label}</FormLabel>
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