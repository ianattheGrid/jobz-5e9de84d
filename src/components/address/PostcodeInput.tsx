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

  const handleSearch = async () => {
    if (!postcode) {
      toast({
        title: "Please enter a postcode",
        variant: "destructive",
      });
      return;
    }
    await onSearch(postcode);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
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
        onClick={handleSearch}
        disabled={loading}
        variant="outline"
      >
        {loading ? "Searching..." : "Find Address"}
      </Button>
    </div>
  );
};