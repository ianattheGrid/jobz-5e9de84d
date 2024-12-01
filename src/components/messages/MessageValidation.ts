import { containsSuspiciousContent } from "@/utils/messageValidation";

export const validateMessage = (messageText: string) => {
  return {
    text: messageText,
    isSuspicious: containsSuspiciousContent(messageText)
  };
};