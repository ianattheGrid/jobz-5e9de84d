
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const VerificationSection = () => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {verificationStatus === 'verified' ? (
            <ShieldCheck className="h-6 w-6 text-green-500" />
          ) : (
            <Shield className="h-6 w-6 text-gray-400" />
          )}
          <h2 className="text-xl font-semibold">Identity Verification</h2>
        </div>
        {verificationStatus === 'verified' && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Verified by {verificationServiceName}
          </Badge>
        )}
        {verificationStatus === 'pending' && (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Verification Pending
          </Badge>
        )}
      </div>
      
      <p className="text-gray-600 mb-4">
        Verify your identity to increase your credibility with potential employers. 
        Choose your preferred verification service, complete their verification process, 
        and upload proof of verification. This is optional but recommended.
      </p>
      
      {verificationStatus !== 'verified' && (
        <>
          <Button
            onClick={startVerification}
            disabled={loading}
            className="w-full sm:w-auto bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
          >
            {loading ? "Starting Verification..." : "Start Verification"}
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Verification Document</DialogTitle>
                <DialogDescription>
                  After completing verification with your chosen service, upload proof of verification here.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="service-name">Verification Service Name</Label>
                  <Input 
                    id="service-name" 
                    placeholder="e.g., Veriff, Onfido, Persona" 
                    value={verificationServiceName}
                    onChange={(e) => setVerificationServiceName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="verification-doc">Verification Document</Label>
                  <Input 
                    id="verification-doc" 
                    type="file" 
                    onChange={handleFileChange} 
                    className="cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <p className="text-xs text-gray-500">
                    Upload PDF or image of your verification certificate or confirmation
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={uploadVerificationDocument}
                  disabled={uploadLoading || !verificationFile}
                  className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
                >
                  {uploadLoading ? "Uploading..." : "Submit"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};
