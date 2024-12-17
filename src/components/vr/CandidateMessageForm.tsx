import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CandidateMessageFormProps {
  candidateEmail: string;
  recommendationId: number;
  onMessageSent?: () => void;
}

const CandidateMessageForm = ({ 
  candidateEmail, 
  recommendationId,
  onMessageSent 
}: CandidateMessageFormProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const { error } = await supabase
        .from('vr_candidate_messages')
        .insert({
          candidate_email: candidateEmail,
          recommendation_id: recommendationId,
          message_text: message
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Your message has been sent to the candidate via Jobz",
      });

      setMessage("");
      onMessageSent?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message to the candidate..."
        className="min-h-[100px]"
        required
      />
      <Button 
        type="submit" 
        disabled={isSending || !message.trim()}
        className="w-full bg-[#ea384c] hover:bg-[#d32d3f] text-white"
      >
        {isSending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};

export default CandidateMessageForm;