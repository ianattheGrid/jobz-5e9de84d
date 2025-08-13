import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import CandidateChatSection from "@/components/chat/CandidateChatSection";

const CandidateChat = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/candidate/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <CandidateChatSection onClose={handleClose} />
        </div>
      </div>
    </div>
  );
};

export default CandidateChat;