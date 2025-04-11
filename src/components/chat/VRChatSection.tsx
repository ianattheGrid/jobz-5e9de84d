
import React from "react";
import AIChatInterface from "./AIChatInterface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const VRChatSection: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Recruiter Assistant</CardTitle>
        <CardDescription>
          Get personalized help with candidate recommendations, commission opportunities, and recruitment strategies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AIChatInterface userType="vr" />
      </CardContent>
    </Card>
  );
};

export default VRChatSection;
