
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useApplicationMessages(applicationId: number, currentUserId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [partnerInfo, setPartnerInfo] = useState<any>(null);
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

  useEffect(() => {
    loadMessages();
    loadApplication();
  }, [applicationId]);

  // Determine if the current user is the candidate
  const isCandidate = application?.applicant_id === currentUserId;
  
  // Determine if the employer has accepted
  const isEmployerAccepted = application?.employer_accepted === true;
  
  // Generate partner name based on role and application status
  const partnerName = isEmployerAccepted && partnerInfo ? 
    (isCandidate ? `${partnerInfo.full_name} from ${partnerInfo.company_name}` : partnerInfo.full_name) :
    (isCandidate ? "Prospective Employer" : "Candidate");

  return {
    messages,
    loading,
    handleSendMessage,
    isEmployerAccepted,
    partnerName,
    currentUserId
  };
}

// Import this here to avoid circular dependencies
import { validateMessage } from "../components/messages/MessageValidation";
