
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface RestrictedAccessMessageProps {
  type: "not-found" | "no-match";
}

export const RestrictedAccessMessage = ({ type }: RestrictedAccessMessageProps) => {
  if (type === "not-found") {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Employer not found</h2>
          <p className="mt-2 text-gray-600">The employer profile you're looking for doesn't exist.</p>
          <Link to="/jobs">
            <Button variant="outline" className="mt-4">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Profile Restricted</h2>
        <p className="mt-2 text-gray-600">
          This employer's profile is only visible after you've matched with one of their job vacancies.
        </p>
        <Link to="/jobs">
          <Button variant="outline" className="mt-4">Browse Jobs</Button>
        </Link>
      </div>
    </div>
  );
};
