import { useEffect, useState } from "react";
import { VerificationStatus } from "./verification/VerificationStatus";
import { VerificationDescription } from "./verification/VerificationDescription";
import { StartVerificationButton } from "./verification/StartVerificationButton";
import { VerificationUploadDialog } from "./verification/VerificationUploadDialog";
import { useVerificationStatus } from "./verification/useVerificationStatus";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export const VerificationSection = () => {
  const {
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
  } = useVerificationStatus();

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("candidate.verification.open");
      setOpen(stored ? stored === "true" : false);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("candidate.verification.open", String(open));
    } catch {}
  }, [open]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Identity verification</h2>
              <span className="text-sm text-gray-600">Status: {verificationStatus || 'unknown'}</span>
            </div>
            <ChevronDown className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 pb-6">
            <VerificationStatus 
              status={verificationStatus} 
              serviceName={verificationServiceName} 
            />
            
            <VerificationDescription />
            
            {verificationStatus !== 'verified' && (
              <>
                <StartVerificationButton 
                  loading={loading} 
                  onClick={startVerification} 
                />

                <VerificationUploadDialog
                  dialogOpen={dialogOpen}
                  setDialogOpen={setDialogOpen}
                  verificationServiceName={verificationServiceName}
                  setVerificationServiceName={setVerificationServiceName}
                  handleFileChange={handleFileChange}
                  uploadVerificationDocument={uploadVerificationDocument}
                  uploadLoading={uploadLoading}
                  verificationFile={verificationFile}
                />
              </>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
