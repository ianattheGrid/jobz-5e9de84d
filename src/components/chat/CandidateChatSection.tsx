
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
          Our AI assistant is temporarily unavailable while we improve the service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <div className="text-muted-foreground">
            We're working on enhancing your AI chat experience. This feature will be available again soon.
          </div>
          <div className="text-sm text-muted-foreground">
            In the meantime, explore our job board and complete your profile to get matched with opportunities.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateChatSection;
