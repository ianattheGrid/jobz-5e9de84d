
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-3 text-gray-600">Loading interviews...</p>
    </div>
  );
};

export default LoadingSpinner;
