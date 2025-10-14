
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, LucideIcon, Star } from "lucide-react";
import type { CandidateProfile } from "@/integrations/supabase/types/profiles";

interface SkillsSectionProps {
  profile: CandidateProfile;
}

const SkillsSection = ({ profile }: SkillsSectionProps) => {
  // Parse skills from the additional_skills field if it exists
  const parseSkills = (skillsString: string | null): string[] => {
    if (!skillsString) return [];
    
    // Try to split by common separators (commas, semicolons, or newlines)
    const skillsArray = skillsString.split(/[,;\n]+/).map(skill => skill.trim()).filter(Boolean);
    return skillsArray;
  };

  const additionalSkills = parseSkills(profile.additional_skills);
  const requiredSkills = profile.required_skills || [];

  // If there are no skills at all, don't render the section
  if (additionalSkills.length === 0 && requiredSkills.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center space-x-2 mb-4">
        <Star className="h-5 w-5 text-blue-500" />
        <h3 className="text-xl font-semibold">Skills & Certifications</h3>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Skills</TabsTrigger>
          {requiredSkills.length > 0 && (
            <TabsTrigger value="technical">Technical Skills</TabsTrigger>
          )}
          {additionalSkills.length > 0 && (
            <TabsTrigger value="additional">Additional Skills</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((skill, index) => (
              <Badge key={`tech-${index}`} variant="outline" className="text-foreground py-1 px-3 font-medium">
                {skill}
              </Badge>
            ))}
            
            {additionalSkills.map((skill, index) => (
              <Badge key={`add-${index}`} variant="outline" className="py-1 px-3 font-medium text-foreground">
                {skill}
              </Badge>
            ))}
          </div>
        </TabsContent>

        {requiredSkills.length > 0 && (
          <TabsContent value="technical" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {requiredSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-foreground py-1 px-3 font-medium">
                  {skill}
                </Badge>
              ))}
            </div>
          </TabsContent>
        )}

        {additionalSkills.length > 0 && (
          <TabsContent value="additional" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {additionalSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="py-1 px-3 font-medium text-foreground">
                  {skill}
                </Badge>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SkillsSection;
