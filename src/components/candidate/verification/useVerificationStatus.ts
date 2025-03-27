
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useVerificationStatus = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>('unverified');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [verificationServiceName, setVerificationServiceName] = useState('');

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('candidate_verifications')
        .select('verification_status, verification_service')
        .eq('candidate_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading verification status:', error);
        return;
      }

      if (data) {
        setVerificationStatus(data.verification_status);
        if (data.verification_service) {
          setVerificationServiceName(data.verification_service);
        }
      }
    } catch (error) {
      console.error('Error loading verification status:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVerificationFile(e.target.files[0]);
    }
  };

  const uploadVerificationDocument = async () => {
    try {
      setUploadLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to verify your identity",
          variant: "destructive"
        });
        return;
      }

      if (!verificationFile) {
        toast({
          title: "Error",
          description: "Please select a verification document to upload",
          variant: "destructive"
        });
        return;
      }

      if (!verificationServiceName) {
        toast({
          title: "Error",
          description: "Please enter the name of the verification service you used",
          variant: "destructive"
        });
        return;
      }

      // Upload the file to Supabase Storage
      const fileName = `verification_${session.user.id}_${Date.now()}`;
      const fileExt = verificationFile.name.split('.').pop();
      const filePath = `${fileName}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('verification_documents')
        .upload(filePath, verificationFile);

      if (uploadError) throw uploadError;

      // Update the verification status
      const { data: urlData } = supabase.storage
        .from('verification_documents')
        .getPublicUrl(filePath);

      // Check if the verification record exists first
      const { data: existingRecord } = await supabase
        .from('candidate_verifications')
        .select('id')
        .eq('candidate_id', session.user.id)
        .single();

      if (existingRecord) {
        // Update existing record
        await supabase
          .from('candidate_verifications')
          .update({
            verification_status: 'pending',
            verification_document_url: urlData.publicUrl,
            verification_service: verificationServiceName
          })
          .eq('candidate_id', session.user.id);
      } else {
        // Insert new record
        await supabase
          .from('candidate_verifications')
          .insert({
            candidate_id: session.user.id,
            verification_status: 'pending',
            verification_document_url: urlData.publicUrl,
            verification_service: verificationServiceName
          });
      }

      setVerificationStatus('pending');
      toast({
        title: "Document Uploaded",
        description: "Your verification document has been submitted and is pending review"
      });
      setDialogOpen(false);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to upload verification document",
        variant: "destructive"
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const startVerification = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to verify your identity",
          variant: "destructive"
        });
        return;
      }

      setDialogOpen(true);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to start verification process",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    verificationStatus,
    verificationServiceName,
    setVerificationServiceName,
    dialogOpen,
    setDialogOpen,
    loading,
    uploadLoading,
    verificationFile,
    handleFileChange,
    uploadVerificationDocument,
    startVerification
  };
};
