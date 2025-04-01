
import React from "react";

interface ChatHeaderProps {
  partnerName: string;
  isEmployerAccepted: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ partnerName, isEmployerAccepted }) => {
  return (
    <div className="bg-muted p-4 rounded-md">
      <h3 className="font-medium mb-2">Chat with {partnerName}</h3>
      <p className="text-sm text-muted-foreground mb-2">
        {isEmployerAccepted 
          ? "You can now discuss specific details about the position."
          : "Please wait for the employer to accept your application to proceed with the interview process."}
      </p>
    </div>
  );
};

export default ChatHeader;
