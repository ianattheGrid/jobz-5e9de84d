import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle } from "lucide-react";

interface Message {
  id: number;
  message_text: string;
  created_at: string;
  is_flagged: boolean;
  sender_id: string;
}

interface ApplicationMessagesProps {
  applicationId: number;
  currentUserId: string;
}

const ApplicationMessages = ({ applicationId, currentUserId }: ApplicationMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Function to check for suspicious content
  const containsSuspiciousContent = (text: string): boolean => {
    const suspiciousPatterns = [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // Email
      /\b\d{10,}\b/, // Phone numbers
      /\b(whatsapp|telegram|skype|linkedin)\b/i, // Social media platforms
      /\b(contact me at|reach me at|call me|email me)\b/i, // Contact phrases
    ];
    return suspiciousPatterns.some(pattern => pattern.test(text));
  };

  // Load messages
  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('recruiter_messages')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load messages",
      });
      return;
    }

    setMessages(data || []);
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    const isSuspicious = containsSuspiciousContent(newMessage);

    try {
      const { error } = await supabase
        .from('recruiter_messages')
        .insert([
          {
            application_id: applicationId,
            sender_id: currentUserId,
            message_text: newMessage,
            is_flagged: isSuspicious,
          }
        ]);

      if (error) throw error;

      if (isSuspicious) {
        toast({
          variant: "destructive",
          title: "Warning",
          description: "Your message contains suspicious content and has been flagged for review.",
        });
      } else {
        toast({
          title: "Success",
          description: "Message sent successfully",
        });
      }

      setNewMessage("");
      loadMessages();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load messages on component mount
  useEffect(() => {
    loadMessages();
  }, [applicationId]);

  return (
    <div className="space-y-4">
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
      <div className="space-y-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[100px]"
        />
        <Button 
          onClick={sendMessage} 
          disabled={loading || !newMessage.trim()}
          className="w-full"
        >
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </div>
  );
};

export default ApplicationMessages;