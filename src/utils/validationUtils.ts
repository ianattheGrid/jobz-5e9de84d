
/**
 * Checks if an email is from a common free email provider
 */
export const isFreeEmailProvider = (email: string): boolean => {
  const freeEmailDomains = [
    'gmail.com', 'yahoo.com', 'ymail.com', 'rocketmail.com',
    'hotmail.com', 'outlook.com', 'live.com', 'msn.com',
    'aol.com', 'icloud.com', 'me.com',
    'proton.me', 'protonmail.com',
    'mail.com', 'zoho.com', 'yandex.com',
    'gmx.com', 'inbox.com', 'fastmail.com'
  ];
  const domain = email.split('@')[1]?.toLowerCase();
  return freeEmailDomains.includes(domain);
};

/**
 * Extracts domain from a URL
 */
export const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname.toLowerCase();
    return domain.startsWith('www.') ? domain.slice(4) : domain;
  } catch {
    return '';
  }
};

/**
 * Checks if email domain matches website domain
 */
export const emailMatchesWebsite = (email: string, website: string): boolean => {
  const emailDomain = email.split('@')[1]?.toLowerCase();
  const websiteDomain = extractDomain(website);
  
  // Some companies use different domains for email vs website
  // e.g. alphabet.com for website but google.com for email
  // So we'll also store known relationships
  const knownRelatedDomains: Record<string, string[]> = {
    'google.com': ['alphabet.com'],
    'alphabet.com': ['google.com'],
    // Add more as needed
  };

  if (emailDomain === websiteDomain) {
    return true;
  }

  // Check related domains
  return knownRelatedDomains[emailDomain]?.includes(websiteDomain) || 
         knownRelatedDomains[websiteDomain]?.includes(emailDomain) || 
         false;
};
