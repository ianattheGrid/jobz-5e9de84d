/**
 * Sector mapping for Webby matching
 * Maps between candidate Proof of Potential sector keys and employer industry sectors
 */

// Maps candidate PoP sector keys to employer sector names
export const CANDIDATE_TO_EMPLOYER_SECTOR_MAP: Record<string, string[]> = {
  'hospitality': ['Hospitality & Food Service', 'Travel & Tourism', 'Retail'],
  'retail': ['Retail', 'Hospitality & Food Service'],
  'travel_tourism': ['Travel & Tourism', 'Hospitality & Food Service'],
  'engineering': ['Manufacturing', 'Automotive', 'Aerospace & Defense', 'Energy & Utilities', 'Construction'],
  'construction': ['Construction', 'Real Estate', 'Outdoor & Environmental'],
  'warehousing': ['Warehousing & Logistics', 'Retail', 'Transport & Delivery'],
  'office_admin': ['Professional Services', 'Finance', 'Real Estate', 'Government & Public Sector'],
  'tech_it': ['Technology'],
  'creative_media': ['Media & Entertainment', 'Technology'],
  'care_support': ['Care & Support Services', 'Healthcare', 'Non-Profit', 'Education'],
  'education': ['Education', 'Non-Profit'],
  'outdoor': ['Outdoor & Environmental', 'Construction'],
  'driving_delivery': ['Transport & Delivery', 'Warehousing & Logistics', 'Retail'],
};

// Maps employer sector names to candidate PoP sector keys (for reverse matching)
export const EMPLOYER_TO_CANDIDATE_SECTOR_MAP: Record<string, string[]> = {
  'Hospitality & Food Service': ['hospitality', 'retail', 'travel_tourism'],
  'Retail': ['retail', 'hospitality', 'warehousing'],
  'Travel & Tourism': ['travel_tourism', 'hospitality'],
  'Manufacturing': ['engineering'],
  'Construction': ['construction', 'outdoor'],
  'Warehousing & Logistics': ['warehousing', 'driving_delivery'],
  'Technology': ['tech_it', 'creative_media'],
  'Healthcare': ['care_support'],
  'Care & Support Services': ['care_support'],
  'Education': ['education', 'care_support'],
  'Media & Entertainment': ['creative_media'],
  'Transport & Delivery': ['driving_delivery', 'warehousing'],
  'Outdoor & Environmental': ['outdoor', 'construction'],
  'Professional Services': ['office_admin'],
  'Finance': ['office_admin'],
  'Real Estate': ['office_admin', 'construction'],
  'Government & Public Sector': ['office_admin'],
  'Non-Profit': ['care_support', 'education'],
  'Energy & Utilities': ['engineering'],
  'Automotive': ['engineering'],
  'Aerospace & Defense': ['engineering'],
};

/**
 * Check if a candidate's next_chapter_sectors match an employer's industry sector
 */
export function checkSectorMatch(
  candidateSectors: string[], 
  employerSector: string | null | undefined
): { matches: boolean; matchedSectors: string[] } {
  if (!employerSector || !candidateSectors?.length) {
    return { matches: false, matchedSectors: [] };
  }
  
  const relevantCandidateSectors = EMPLOYER_TO_CANDIDATE_SECTOR_MAP[employerSector] || [];
  const matchedSectors = candidateSectors.filter(s => relevantCandidateSectors.includes(s));
  
  return {
    matches: matchedSectors.length > 0,
    matchedSectors
  };
}

/**
 * Get employer sectors that match a candidate's PoP sectors
 */
export function getMatchingEmployerSectors(candidateSectors: string[]): string[] {
  if (!candidateSectors?.length) return [];
  
  const matchingSectors = new Set<string>();
  
  for (const sector of candidateSectors) {
    const employerSectors = CANDIDATE_TO_EMPLOYER_SECTOR_MAP[sector] || [];
    employerSectors.forEach(s => matchingSectors.add(s));
  }
  
  return Array.from(matchingSectors);
}

/**
 * Format sector keys to human-readable labels
 */
export function formatSectorLabel(sectorKey: string): string {
  const labels: Record<string, string> = {
    'hospitality': 'Hospitality',
    'retail': 'Retail',
    'travel_tourism': 'Travel & Tourism',
    'engineering': 'Engineering',
    'construction': 'Construction',
    'warehousing': 'Warehousing & Logistics',
    'office_admin': 'Office & Admin',
    'tech_it': 'Tech & IT',
    'creative_media': 'Creative & Media',
    'care_support': 'Care & Support',
    'education': 'Education',
    'outdoor': 'Outdoor Work',
    'driving_delivery': 'Driving & Delivery',
  };
  
  return labels[sectorKey] || sectorKey;
}
