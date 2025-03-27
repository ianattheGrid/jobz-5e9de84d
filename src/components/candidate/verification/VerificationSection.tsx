
import { useVerificationStatus } from "./useVerificationStatus";
import { VerificationStatus } from "./VerificationStatus";
import { VerificationDescription } from "./VerificationDescription";
import { StartVerificationButton } from "./StartVerificationButton";
import { VerificationUploadDialog } from "./VerificationUploadDialog";
import { Card } from "@/components/ui/card";

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

  // Don't show the section if the user is verified
  if (verificationStatus === 'verified') {
    return (
      <Card className="p-6 mb-8 border border-gray-200 shadow-sm">
        <VerificationStatus status={verificationStatus} serviceName={verificationServiceName} />
        <p className="text-green-600 font-medium">
          Your identity is verified! This increases your visibility to employers and improves your chances of being contacted.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-8 border border-gray-200 shadow-sm">
      <VerificationStatus status={verificationStatus} serviceName={verificationServiceName} />
      
      <VerificationDescription />
      
      <div className="flex justify-start">
        {verificationStatus === 'pending' ? (
          <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded border border-yellow-200">
            <p className="font-medium">Verification in Progress</p>
            <p className="text-sm">Your verification document is being reviewed. This usually takes 1-2 business days.</p>
          </div>
        ) : (
          <StartVerificationButton loading={loading} onClick={startVerification} />
        )}
      </div>

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
    </Card>
  );
};
