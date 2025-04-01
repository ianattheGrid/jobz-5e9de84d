
import React from "react";
import { AlertTriangle } from "lucide-react";
import { RecruiterMessage } from "@/integrations/supabase/types/messages";

interface MessageListProps {
  messages: RecruiterMessage[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  return (
    <div className="h-96 overflow-y-auto space-y-4 p-4 border rounded-lg">
      {messages.length === 0 && (
        <div className="text-center text-muted-foreground p-4">
          <p>No messages yet. Start the conversation!</p>
        </div>
      )}
      
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 rounded-lg ${
            message.is_system_message
              ? "bg-blue-50 border border-blue-100 text-center"
              : message.sender_id === currentUserId
              ? "bg-blue-100 ml-auto"
              : "bg-gray-100"
          } max-w-[80%] relative ${message.is_system_message ? "mx-auto" : ""}`}
        >
          {message.is_flagged && (
            <AlertTriangle className="h-4 w-4 text-yellow-500 absolute top-2 right-2" />
          )}
          <p className={`text-sm ${message.is_system_message ? "text-blue-700 font-medium" : ""}`}>
            {message.message_text}
          </p>
          {!message.is_system_message && (
            <span className="text-xs text-gray-500">
              {new Date(message.created_at).toLocaleString()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
