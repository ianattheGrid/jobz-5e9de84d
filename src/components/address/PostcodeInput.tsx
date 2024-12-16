import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface PostcodeInputProps {
  onSearch: (postcode: string) => Promise<void>;
  loading: boolean;
}

export const PostcodeInput = ({ onSearch, loading }: PostcodeInputProps) => {
  const [postcode, setPostcode] = useState("");
  const { toast } = useToast();

  // UK postcode regex pattern
  const postcodePattern = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

  const validatePostcode = (postcode: string) => {
    return postcodePattern.test(postcode.trim());
  };

  const handleSearch = async () => {
    const trimmedPostcode = postcode.trim();
    if (!trimmedPostcode) {
      toast({
        title: "Please enter a postcode",
        variant: "destructive",
      });
      return;
    }

    if (!validatePostcode(trimmedPostcode)) {
      toast({
        title: "Invalid postcode format",
        description: "Please enter a valid UK postcode",
        variant: "destructive",
      });
      return;
    }

    await onSearch(trimmedPostcode);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const formatPostcode = (value: string) => {
    // Convert to uppercase and remove multiple spaces
    let formatted = value.toUpperCase().replace(/\s+/g, ' ');
    return formatted;
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter UK postcode"
        value={postcode}
        onChange={(e) => setPostcode(formatPostcode(e.target.value))}
        onKeyPress={handleKeyPress}
        className="max-w-[200px]"
      />
      <Button 
        type="button"
        onClick={handleSearch}
        disabled={loading}
        variant="outline"
      >
        {loading ? "Searching..." : "Find Address"}
      </Button>
    </div>
  );
};