import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateMessage } from "@/components/messages/MessageValidation";

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

    const validatedMessage = validateMessage(message);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('vr_candidate_messages')
        .insert({
          vr_id: user.id,
          candidate_email: candidateEmail,
          recommendation_id: recommendationId,
          message_text: message,
          is_flagged: validatedMessage.isSuspicious
        });

      if (error) throw error;

      toast({
        title: validatedMessage.isSuspicious 
          ? "Message sent with caution" 
          : "Message sent",
        description: validatedMessage.isSuspicious
          ? "Your message contains suspicious content and has been flagged."
          : "Your message has been sent to the candidate via Jobz",
        variant: validatedMessage.isSuspicious ? "destructive" : "default"
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