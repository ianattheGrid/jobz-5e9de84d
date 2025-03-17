
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
    <div className="flex justify-start">
      <Button 
        type="submit" 
        style={{ backgroundColor: "#FF69B4", color: "white" }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Updating..." : "Update Profile"}
      </Button>
    </div>
  );
};

export default SubmitButton;
