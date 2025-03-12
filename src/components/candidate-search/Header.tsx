
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

export const Header = () => {
  return (
    <>
      <div className="flex justify-end mb-4">
        <Link to="/employer/dashboard">
          <Button 
            variant="default"
            className="bg-primary hover:bg-primary/90 text-white gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-4xl font-bold text-primary [&]:!text-primary">Search Candidates</h1>
        <p className="mt-2 text-neutral-200">
          Find the perfect candidates for your roles by using our advanced search filters.
        </p>
      </div>
    </>
  );
};
