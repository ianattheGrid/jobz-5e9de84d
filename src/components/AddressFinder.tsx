import { useState } from "react";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "./candidate/candidateFormSchema";
import { lookupAddresses } from "@/lib/addressLookup";
import { useToast } from "@/components/ui/use-toast";
import { PostcodeInput } from "./address/PostcodeInput";
import { AddressSelect } from "./address/AddressSelect";

interface AddressFinderProps {
  control: Control<CandidateFormValues>;
}

interface Address {
  postcode: string;
  address: string;
}

const AddressFinder = ({ control }: AddressFinderProps) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const { toast } = useToast();

  const findAddresses = async (postcode: string) => {
    setLoading(true);
    try {
      const foundAddresses = await lookupAddresses(postcode);
      setAddresses(foundAddresses);
      setShowSelect(true);
      
      if (foundAddresses.length === 0) {
        toast({
          title: "No addresses found",
          description: "Please check the postcode and try again",
          variant: "destructive",
        });
        setShowSelect(false);
      }
    } catch (error) {
      toast({
        title: "Error finding addresses",
        description: "Please try again later",
        variant: "destructive",
      });
      setShowSelect(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PostcodeInput onSearch={findAddresses} loading={loading} />
      {showSelect && addresses.length > 0 && (
        <AddressSelect control={control} addresses={addresses} />
      )}
    </div>
  );
};

export default AddressFinder;