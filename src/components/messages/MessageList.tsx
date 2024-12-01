import { AlertTriangle } from "lucide-react";

interface Message {
  id: number;
  message_text: string;
  created_at: string;
  is_flagged: boolean;
  sender_id: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  return (
    <div className="h-96 overflow-y-auto space-y-4 p-4 border rounded-lg">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 rounded-lg ${
            message.sender_id === currentUserId
              ? "bg-blue-100 ml-auto"
              : "bg-gray-100"
          } max-w-[80%] relative`}
        >
          {message.is_flagged && (
            <AlertTriangle className="h-4 w-4 text-yellow-500 absolute top-2 right-2" />
          )}
          <p className="text-sm">{message.message_text}</p>
          <span className="text-xs text-gray-500">
            {new Date(message.created_at).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;