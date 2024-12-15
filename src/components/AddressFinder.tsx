import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "./candidate/candidateFormSchema";

interface AddressFinderProps {
  control: Control<CandidateFormValues>;
}

interface Address {
  postcode: string;
  address: string;
}

const AddressFinder = ({ control }: AddressFinderProps) => {
  const [postcode, setPostcode] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  const findAddresses = async () => {
    if (!postcode) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}/autocomplete`);
      const data = await response.json();
      
      if (data.result) {
        const formattedAddresses = data.result.map((pc: string) => ({
          postcode: pc,
          address: pc
        }));
        setAddresses(formattedAddresses);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          className="max-w-[200px]"
        />
        <Button 
          type="button"
          onClick={findAddresses}
          disabled={loading}
          variant="outline"
        >
          {loading ? "Searching..." : "Find Address"}
        </Button>
      </div>

      {addresses.length > 0 && (
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Address</FormLabel>
              <FormControl>
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value || ""}
                >
                  <option value="">Select an address</option>
                  {addresses.map((addr, index) => (
                    <option key={index} value={addr.address}>
                      {addr.address}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default AddressFinder;