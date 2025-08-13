import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import CandidateChatSection from "@/components/chat/CandidateChatSection";

const CandidateChat = () => {
  console.log('[CandidateChat] Component initialized');
  const navigate = useNavigate();

  const handleClose = () => {
    console.log('[CandidateChat] handleClose called');
    navigate("/candidate/dashboard");
  };

  console.log('[CandidateChat] Component rendering');
  
  return (
    <div className="min-h-screen bg-white">{/* Changed from bg-background to bg-white */}
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