import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";

export default function ActionButtons() {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 mb-8">
      <Button 
        onClick={() => navigate('/employer/create-vacancy')}
        className="bg-red-800 hover:bg-red-900"
      >
        <Plus className="mr-2 h-4 w-4" />
        Post New Vacancy
      </Button>
      <Button 
        onClick={() => navigate('/employer/candidate-search')}
        className="bg-red-800 hover:bg-red-900"
      >
        <Search className="mr-2 h-4 w-4" />
        Search Candidates
      </Button>
    </div>
  );
}