/**
 * Second Chapter Profile Types
 * For candidates looking to transition into a different role or sector
 */

export type SectorTransitionType = 'stay_same_sector_new_role' | 'new_sector' | 'either';

export interface SecondChapter {
  // Block 1: Sectors for My Second Chapter
  second_chapter_sectors?: string[];
  second_chapter_sectors_other?: string | null;
  sector_transition_type?: SectorTransitionType;
  second_chapter_sector_note?: string | null;
  
  // Block 2: Role Shape
  second_chapter_role_shape_tags?: string[];
  second_chapter_role_shape_other?: string | null;
  
  // Block 3: Team Contribution
  second_chapter_team_contribution_tags?: string[];
  second_chapter_team_contribution_other?: string | null;
  
  // Block 4: Environment & Structure
  second_chapter_environment_tags?: string[];
  second_chapter_work_structure_tags?: string[];
  second_chapter_environment_other?: string | null;
  
  // Block 5: In My Own Words
  second_chapter_summary?: string | null;
}

// Type guard to check if second_chapter data exists and has meaningful content
export function hasSecondChapterData(data: SecondChapter | null | undefined): boolean {
  if (!data) return false;
  
  return !!(
    (data.second_chapter_sectors && data.second_chapter_sectors.length > 0) ||
    data.sector_transition_type ||
    data.second_chapter_sector_note ||
    (data.second_chapter_role_shape_tags && data.second_chapter_role_shape_tags.length > 0) ||
    (data.second_chapter_team_contribution_tags && data.second_chapter_team_contribution_tags.length > 0) ||
    (data.second_chapter_environment_tags && data.second_chapter_environment_tags.length > 0) ||
    (data.second_chapter_work_structure_tags && data.second_chapter_work_structure_tags.length > 0) ||
    data.second_chapter_summary
  );
}
