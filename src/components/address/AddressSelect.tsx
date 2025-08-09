import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidate/candidateFormSchema";

interface Address {
  postcode: string;
  address: string;
}

interface AddressSelectProps {
  control: Control<CandidateFormValues>;
  addresses: Address[];
}

export const AddressSelect = ({ control, addresses }: AddressSelectProps) => {
  return (
    <FormField
      control={control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select your full address</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || undefined}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="bg-white text-gray-900">
                <SelectValue placeholder="Choose your address from the list" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white text-gray-900 z-50">
              {addresses.map((addr, index) => (
                <SelectItem key={index} value={addr.address}>
                  {addr.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};