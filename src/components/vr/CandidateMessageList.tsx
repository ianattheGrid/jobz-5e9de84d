import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface VRCandidateMessage {
  id: number;
  message_text: string;
  created_at: string;
  is_flagged: boolean;
  candidate_email: string;
}

interface CandidateMessageListProps {
  recommendationId: number;
}

const CandidateMessageList = ({ recommendationId }: CandidateMessageListProps) => {
  const [messages, setMessages] = useState<VRCandidateMessage[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('vr_candidate_messages')
        .select('*')
        .eq('recommendation_id', recommendationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();
  }, [recommendationId]);

  return (
    <div className="space-y-2">
      {messages.map((message) => (
        <Card key={message.id} className="p-4 relative">
          {message.is_flagged && (
            <AlertTriangle className="h-4 w-4 text-yellow-500 absolute top-2 right-2" />
          )}
          <p>{message.message_text}</p>
          <span className="text-xs text-gray-500">
            {new Date(message.created_at).toLocaleString()}
          </span>
        </Card>
      ))}
    </div>
  );
};

export default CandidateMessageList;