import React from "react";
import AIChatInterface from "./AIChatInterface";

interface CandidateChatSectionProps {
  onClose?: () => void;
}

const CandidateChatSection: React.FC<CandidateChatSectionProps> = ({ onClose }) => {
  return <AIChatInterface userType="candidate" onClose={onClose} />;
};

export default CandidateChatSection;
