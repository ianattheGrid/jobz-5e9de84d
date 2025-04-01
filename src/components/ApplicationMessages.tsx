
import React from "react";
import MessageList from "./messages/MessageList";
import MessageInput from "./messages/MessageInput";
import ChatHeader from "./messages/ChatHeader";
import { useApplicationMessages } from "@/hooks/useApplicationMessages";

interface ApplicationMessagesProps {
  applicationId: number;
  currentUserId: string;
}

const ApplicationMessages: React.FC<ApplicationMessagesProps> = ({ 
  applicationId, 
  currentUserId 
}) => {
  const {
    messages,
    loading,
    handleSendMessage,
    isEmployerAccepted,
    partnerName,
    currentUserId: userId
  } = useApplicationMessages(applicationId, currentUserId);

  return (
    <div className="space-y-4">
      <ChatHeader 
        partnerName={partnerName} 
        isEmployerAccepted={isEmployerAccepted} 
      />
      
      <MessageList 
        messages={messages} 
        currentUserId={userId} 
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        loading={loading} 
      />
    </div>
  );
};

export default ApplicationMessages;
