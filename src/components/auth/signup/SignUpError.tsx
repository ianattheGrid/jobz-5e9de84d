
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignUpErrorProps {
  error: string | null;
  isBlocked: boolean;
}

export const SignUpError = ({ error, isBlocked }: SignUpErrorProps) => {
  if (!error && !isBlocked) return null;
  
  return (
    <Alert variant="destructive">
      <AlertDescription>
        {error || "Too many signup attempts from this IP address. Please try again later."}
      </AlertDescription>
    </Alert>
  );
};

