export const containsSuspiciousContent = (text: string): boolean => {
  const suspiciousPatterns = [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // Email
    /\b\d{10,}\b/, // Phone numbers
    /\b(whatsapp|telegram|skype|linkedin)\b/i, // Social media platforms
    /\b(contact me at|reach me at|call me|email me)\b/i, // Contact phrases
  ];
  return suspiciousPatterns.some(pattern => pattern.test(text));
};