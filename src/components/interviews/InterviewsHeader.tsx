
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

const InterviewsHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-start mb-8">
      <h1 className="text-3xl font-bold text-gray-900">My Interviews</h1>
      <Button
        onClick={() => navigate('/candidate/dashboard')}
        className="text-white"
        variant="default"
      >
        <LayoutDashboard className="w-4 h-4 mr-2" />
        Dashboard
      </Button>
    </div>
  );
};

export default InterviewsHeader;
