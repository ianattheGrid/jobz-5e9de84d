/**
 * Anonymization utilities for Webby real-time matching
 * Generates consistent pseudonyms for candidates/employers during a session
 */

// Store pseudonym mappings in session
const pseudonymMap = new Map<string, string>();

const LETTER_CODES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Generate a consistent pseudonym for a user ID
 * Format: "Candidate A", "Candidate B", etc. for candidates
 *         "Employer X", "Employer Y", etc. for employers
 */
export function getPseudonym(userId: string, userType: 'candidate' | 'employer'): string {
  // Check if we already have a pseudonym for this user
  if (pseudonymMap.has(userId)) {
    return pseudonymMap.get(userId)!;
  }

  // Generate new pseudonym
  const letterIndex = pseudonymMap.size % LETTER_CODES.length;
  const letter = LETTER_CODES[letterIndex];
  const prefix = userType === 'candidate' ? 'Candidate' : 'Employer';
  const pseudonym = `${prefix} ${letter}`;

  // Store it
  pseudonymMap.set(userId, pseudonym);
  return pseudonym;
}

/**
 * Generate a descriptive pseudonym based on role/title
 * Format: "Candidate A – Local evening staff"
 */
export function getDescriptivePseudonym(
  userId: string,
  userType: 'candidate' | 'employer',
  description: string
): string {
  const basePseudonym = getPseudonym(userId, userType);
  return `${basePseudonym} – ${description}`;
}

/**
 * Get rough location area (postcode sector like "BS5" or "City Centre")
 */
export function getRoughLocation(location?: string[] | null): string {
  if (!location || location.length === 0) return 'Location not specified';
  
  const firstLocation = location[0];
  // Extract postcode sector (first part before space)
  const postcodeMatch = firstLocation.match(/^([A-Z]{1,2}\d{1,2})/);
  if (postcodeMatch) {
    return `Near ${postcodeMatch[1]}`;
  }
  
  // Otherwise use first few words
  const words = firstLocation.split(' ').slice(0, 2).join(' ');
  return `Near ${words}`;
}

/**
 * Format pay expectations anonymously
 */
export function formatPayRange(minHourly?: number | null, minAnnual?: number | null): string {
  if (minHourly) {
    const max = Math.round(minHourly * 1.15); // Add 15% range
    return `£${minHourly}–£${max}/hr`;
  }
  if (minAnnual) {
    const max = Math.round(minAnnual * 1.15);
    return `£${(minAnnual / 1000).toFixed(0)}–${(max / 1000).toFixed(0)}k`;
  }
  return 'Pay expectations not specified';
}

/**
 * Format availability summary
 */
export function formatAvailability(
  slots?: any,
  hoursMin?: number | null,
  hoursMax?: number | null
): string {
  const parts: string[] = [];
  
  if (hoursMin && hoursMax) {
    if (hoursMin === hoursMax) {
      parts.push(`${hoursMin} hrs/week`);
    } else {
      parts.push(`${hoursMin}–${hoursMax} hrs/week`);
    }
  }
  
  // Parse availability slots if available
  if (slots && typeof slots === 'object') {
    const days = Object.keys(slots).filter(day => slots[day]?.available);
    if (days.length > 0) {
      parts.push(days.length < 7 ? `${days.length} days/week` : 'All days');
    }
  }
  
  return parts.length > 0 ? parts.join(' · ') : 'Availability not specified';
}

/**
 * Clear all pseudonyms (call when user navigates away)
 */
export function clearPseudonyms(): void {
  pseudonymMap.clear();
}
