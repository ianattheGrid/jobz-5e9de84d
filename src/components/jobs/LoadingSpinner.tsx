
import { CircleNotch } from "lucide-react"

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <CircleNotch className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-gray-600">Loading jobs...</p>
    </div>
  );
};

export default LoadingSpinner;
