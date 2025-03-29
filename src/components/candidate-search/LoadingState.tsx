
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="w-full py-12">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Loading candidates...</p>
      </div>
    </div>
  );
};
