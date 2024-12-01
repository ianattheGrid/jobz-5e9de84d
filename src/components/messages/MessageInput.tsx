import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
}

const MessageInput = ({ onSendMessage, loading }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        className="min-h-[100px]"
      />
      <Button 
        onClick={handleSend} 
        disabled={loading || !newMessage.trim()}
        className="w-full"
      >
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </div>
  );
};

export default MessageInput;