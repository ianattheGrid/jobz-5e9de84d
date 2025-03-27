
import { VerificationStatus } from "./verification/VerificationStatus";
import { VerificationDescription } from "./verification/VerificationDescription";
import { StartVerificationButton } from "./verification/StartVerificationButton";
import { VerificationUploadDialog } from "./verification/VerificationUploadDialog";
import { useVerificationStatus } from "./verification/useVerificationStatus";

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
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
  );
};
