
import React from "react";
import AIChatInterface from "./AIChatInterface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const EmployerChatSection: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Recruitment Assistant</CardTitle>
        <CardDescription>
          Get personalized help with job postings, talent acquisition, and hiring processes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AIChatInterface userType="employer" />
      </CardContent>
    </Card>
  );
};

export default EmployerChatSection;
