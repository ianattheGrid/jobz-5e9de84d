import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MessageList from "./messages/MessageList";
import MessageInput from "./messages/MessageInput";
import { containsSuspiciousContent } from "@/utils/messageValidation";

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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const handleSendMessage = async (messageText: string) => {
    setLoading(true);
    const isSuspicious = containsSuspiciousContent(messageText);

    try {
      const { error } = await supabase
        .from('recruiter_messages')
        .insert([
          {
            application_id: applicationId,
            sender_id: currentUserId,
            message_text: messageText,
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

  useEffect(() => {
    loadMessages();
  }, [applicationId]);

  return (
    <div className="space-y-4">
      <MessageList messages={messages} currentUserId={currentUserId} />
      <MessageInput onSendMessage={handleSendMessage} loading={loading} />
    </div>
  );
};

export default ApplicationMessages;