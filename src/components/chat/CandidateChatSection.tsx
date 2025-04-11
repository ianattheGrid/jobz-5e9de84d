
import React from "react";
import AIChatInterface from "./AIChatInterface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CandidateChatSectionProps {
  onClose?: () => void;
}

const CandidateChatSection: React.FC<CandidateChatSectionProps> = ({ onClose }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Career Assistant</CardTitle>
        <CardDescription>
          Get personalized help with your job search, applications, and career questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AIChatInterface userType="candidate" onClose={onClose} />
      </CardContent>
    </Card>
  );
};

export default CandidateChatSection;
