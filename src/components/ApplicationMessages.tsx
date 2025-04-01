
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MessageList from "./messages/MessageList";
import MessageInput from "./messages/MessageInput";
import { validateMessage } from "./messages/MessageValidation";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Message {
  id: number;
  message_text: string;
  created_at: string;
  is_flagged: boolean;
  sender_id: string;
  is_system_message?: boolean;
}

interface ApplicationMessagesProps {
  applicationId: number;
  currentUserId: string;
}

const ApplicationMessages = ({ applicationId, currentUserId }: ApplicationMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [identityRevealed, setIdentityRevealed] = useState(false);
  const [showRevealDialog, setShowRevealDialog] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState<any>(null);
  const [messageCount, setMessageCount] = useState(0);
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
    setMessageCount((data || []).length);
  };

  const loadApplication = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (title, company, employer_id),
        candidate_profiles!applications_applicant_id_fkey (full_name, email, current_employer)
      `)
      .eq('id', applicationId)
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load application details",
      });
      return;
    }

    setApplication(data);
    
    // Check if identities have been revealed
    const { data: revealData } = await supabase
      .from('identity_reveals')
      .select('*')
      .eq('application_id', applicationId)
      .maybeSingle();
      
    setIdentityRevealed(!!revealData);

    // Load partner info based on user role
    if (data.applicant_id === currentUserId) {
      // Current user is the candidate, load employer info
      const { data: employerData, error: employerError } = await supabase
        .from('employer_profiles')
        .select('full_name, company_name')
        .eq('id', data.jobs.employer_id)
        .single();
        
      if (!employerError) {
        setPartnerInfo(employerData);
      }
    } else {
      // Current user is the employer, load candidate info
      setPartnerInfo(data.candidate_profiles);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    setLoading(true);
    const { text, isSuspicious } = validateMessage(messageText);

    try {
      const { error } = await supabase
        .from('recruiter_messages')
        .insert([
          {
            application_id: applicationId,
            sender_id: currentUserId,
            message_text: text,
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

  const handleRevealIdentity = async () => {
    try {
      // Insert a record for identity reveal
      const { error } = await supabase
        .from('identity_reveals')
        .insert({
          application_id: applicationId,
          revealed_by: currentUserId,
          revealed_at: new Date().toISOString()
        });

      if (error) throw error;

      setIdentityRevealed(true);
      setShowRevealDialog(false);
      
      // Notify the other party with a system message
      const isEmployer = application?.applicant_id !== currentUserId;
      const revealMessage = isEmployer 
        ? "The employer has revealed their identity. You can now see their complete details."
        : "The candidate has revealed their identity. You can now see their complete details.";
        
      await supabase
        .from('recruiter_messages')
        .insert({
          application_id: applicationId,
          sender_id: currentUserId,
          message_text: revealMessage,
          is_system_message: true
        });
      
      loadMessages();
      
      toast({
        title: "Identity Revealed",
        description: "You have successfully revealed your identity",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reveal identity",
      });
    }
  };

  useEffect(() => {
    loadMessages();
    loadApplication();
  }, [applicationId]);

  const canRevealIdentity = messageCount >= 3 && !identityRevealed;
  const isCandidate = application?.applicant_id === currentUserId;
  const partnerName = identityRevealed && partnerInfo ? 
    (isCandidate ? `${partnerInfo.full_name} from ${partnerInfo.company_name}` : partnerInfo.full_name) :
    (isCandidate ? "Prospective Employer" : "Candidate");

  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Chat with {partnerName}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {identityRevealed 
            ? "Full identities have been revealed. You can now discuss specific details about the position."
            : "Your identity is protected until revealed. Focus on discussing skills and experience first."}
        </p>
        {canRevealIdentity && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setShowRevealDialog(true)}
          >
            <Eye className="h-4 w-4" />
            Reveal Your Identity
          </Button>
        )}
      </div>
      
      <MessageList 
        messages={messages} 
        currentUserId={currentUserId} 
        identityRevealed={identityRevealed} 
      />
      
      <MessageInput onSendMessage={handleSendMessage} loading={loading} />
      
      {/* Identity reveal confirmation dialog */}
      <Dialog open={showRevealDialog} onOpenChange={setShowRevealDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reveal Your Identity?</DialogTitle>
            <DialogDescription>
              This will share your full identity details with the other party. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <p className="text-sm">
                We recommend establishing rapport before revealing identities. Both parties will need to reveal their identities separately.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowRevealDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRevealIdentity}>
                Confirm Reveal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationMessages;
