
import React from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import LoadingSpinner from "@/components/interviews/LoadingSpinner";
import InterviewsTable from "@/components/interviews/InterviewsTable";
import { useInterviews } from "@/hooks/useInterviews";

const CandidateInterviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: interviews, isLoading } = useInterviews(user?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto py-8 pt-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto py-8 pt-20">
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

        {interviews && interviews.length > 0 ? (
          <InterviewsTable interviews={interviews} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No interviews scheduled yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateInterviews;
