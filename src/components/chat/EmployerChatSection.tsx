
import React from "react";
import AIChatInterface from "./AIChatInterface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface EmployerChatSectionProps {
  onClose?: () => void;
}

const EmployerChatSection: React.FC<EmployerChatSectionProps> = ({ onClose }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Recruitment Assistant</CardTitle>
        <CardDescription>
          Get personalized help with job postings, talent acquisition, and hiring processes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AIChatInterface userType="employer" onClose={onClose} />
      </CardContent>
    </Card>
  );
};

export default EmployerChatSection;
