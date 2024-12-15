import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "./candidate/candidateFormSchema";
import { lookupAddresses } from "@/lib/addressLookup";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const findAddresses = async () => {
    if (!postcode) {
      toast({
        title: "Please enter a postcode",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const foundAddresses = await lookupAddresses(postcode);
      setAddresses(foundAddresses);
      
      if (foundAddresses.length === 0) {
        toast({
          title: "No addresses found",
          description: "Please check the postcode and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error finding addresses",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      findAddresses();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an address" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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
      )}
    </div>
  );
};

export default AddressFinder;