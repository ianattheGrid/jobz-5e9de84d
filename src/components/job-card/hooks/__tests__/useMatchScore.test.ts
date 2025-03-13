
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { calculateSkillsMatchScore } from "../../utils/skillsMatching";

describe('Job Matching Algorithm', () => {
  describe('Skills Matching', () => {
    it('should match exact skills', () => {
      const score = calculateSkillsMatchScore(
        ['JavaScript', 'React', 'TypeScript'],
        ['JavaScript', 'React', 'TypeScript']
      );
      expect(score).toBe(1); // Perfect match
    });

    it('should match similar skills', () => {
      const score = calculateSkillsMatchScore(
        ['JavaScript', 'ReactJS', 'TypeScript'],
        ['JavaScript', 'React', 'TypeScript']
      );
      expect(score).toBe(1); // Should recognize React and ReactJS as same
    });

    it('should handle partial matches', () => {
      const score = calculateSkillsMatchScore(
        ['JavaScript', 'React', 'TypeScript', 'Node.js'],
        ['JavaScript', 'React']
      );
      expect(score).toBe(1); // Candidate has more skills than required
    });

    it('should handle case insensitivity', () => {
      const score = calculateSkillsMatchScore(
        ['javascript', 'react', 'typescript'],
        ['JavaScript', 'React', 'TypeScript']
      );
      expect(score).toBe(1);
    });

    it('should handle empty arrays', () => {
      expect(calculateSkillsMatchScore([], [])).toBe(0);
      expect(calculateSkillsMatchScore(['JavaScript'], [])).toBe(0);
      expect(calculateSkillsMatchScore([], ['JavaScript'])).toBe(0);
    });
  });

  // Test the complete matching algorithm
  describe('Complete Match Score', () => {
    const mockJob = {
      id: 1,
      title: "Senior Frontend Developer",
      description: "Looking for a skilled frontend developer",
      company: "Test Company",
      location: "Bristol",
      salary_min: 50000,
      salary_max: 80000,
      type: "Full-time",
      created_at: new Date().toISOString(),
      candidate_commission: null,
      holiday_entitlement: 25,
      company_benefits: "Health insurance",
      employer_id: "123",
      required_qualifications: ["BSc"],
      title_essential: true,
      years_experience_essential: true,
      min_years_experience: 5,
      salary_essential: true,
      skills_essential: true,
      qualification_essential: false,
      citizenship_essential: false,
      required_citizenship: "UK citizens only",
      work_area: "Frontend Development",
      specialization: "Frontend",
      match_threshold: 70,
      required_skills: ["React", "TypeScript"],
      min_years_in_title: 3
    };

    const mockProfile: CandidateProfile = {
      id: "123",
      email: "test@example.com",
      job_title: "Senior Frontend Developer",
      years_experience: 6,
      location: ["Bristol"],
      min_salary: 55000,
      max_salary: 75000,
      required_qualifications: ["BSc"],
      required_skills: ["React", "TypeScript"],
      security_clearance: null,
      commission_percentage: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      signup_date: new Date().toISOString(),
      work_eligibility: "UK citizens only",
      preferred_work_type: "office",
      availability: "Immediate",
      additional_skills: null,
      address: null,
      ai_synopsis: null,
      ai_synopsis_last_updated: null,
      ai_synopsis_status: "pending",
      current_employer: null,
      cv_url: null,
      full_name: null,
      phone_number: null,
      profile_picture_url: null,
      travel_radius: 10,
      work_preferences: null,
      desired_job_title: null,
      home_postcode: null,
      linkedin_url: null,
      years_in_current_title: 4
    };

    it('should calculate high match score for well-matching profiles', () => {
      const { totalScore } = useMatchScore(mockProfile, mockJob);
      expect(totalScore).toBeGreaterThan(0.8); // Should be a strong match
    });

    it('should handle missing data gracefully', () => {
      const incompleteProfile = { ...mockProfile, required_skills: null };
      const { totalScore } = useMatchScore(incompleteProfile, mockJob);
      expect(totalScore).toBeDefined();
      expect(totalScore).toBeGreaterThanOrEqual(0);
      expect(totalScore).toBeLessThanOrEqual(1);
    });
  });
});
