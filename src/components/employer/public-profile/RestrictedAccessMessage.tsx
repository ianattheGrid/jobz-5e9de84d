
import { ShieldAlert, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface RestrictedAccessMessageProps {
  type: "no-match" | "not-found";
}

export const RestrictedAccessMessage = ({ type }: RestrictedAccessMessageProps) => {
  const isNotFound = type === "not-found";
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-100 text-center">
        {isNotFound ? (
          <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        ) : (
          <ShieldAlert className="h-12 w-12 mx-auto text-amber-500 mb-4" />
        )}
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {isNotFound ? "Profile Not Found" : "Access Restricted"}
        </h2>
        
        <p className="text-gray-700 mb-6">
          {isNotFound 
            ? "The employer profile you're looking for doesn't exist or may have been removed."
            : "You can only view this employer's details after matching with one of their job positions."}
        </p>
        
        <Link to="/jobs">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white">
            Browse Available Jobs
          </Button>
        </Link>
      </div>
    </div>
  );
};
