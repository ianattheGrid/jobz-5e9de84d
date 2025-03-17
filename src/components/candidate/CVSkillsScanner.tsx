
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CVSkillsScannerProps {
  cvUrl: string | null;
}

export const CVSkillsScanner = ({ cvUrl }: CVSkillsScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [detectedSkills, setDetectedSkills] = useState<string[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const { toast } = useToast();

  const scanCV = async () => {
    if (!cvUrl) {
      toast({
        variant: "destructive",
        title: "No CV Found",
        description: "Please upload a CV before scanning for skills.",
      });
      return;
    }

    try {
      setScanning(true);
      
      // Balanced skill list with technical, professional, creative and industry-specific skills
      const skillsToScan = [
        // Professional Skills
        "Project Management", "Team Leadership", "Strategic Planning",
        "Business Analysis", "Client Relations", "Communication",
        "Presentation", "Problem Solving", "Negotiation",
        
        // Web & Design Skills
        "Web Design", "UI Design", "UX Design", "Responsive Design",
        "User Interface", "User Experience", "Wireframing", "Prototyping", 
        "Visual Design", "Interaction Design", "Information Architecture",
        
        // App Development
        "Mobile Development", "App Development", "iOS Development",
        "Android Development", "Cross Platform", "Hybrid Apps",
        
        // Programming & Tech
        "JavaScript", "TypeScript", "React", "Angular", 
        "Vue", "Node.js", "HTML", "CSS", "SASS",
        "PHP", "Python", "Java", "SQL", "NoSQL",
        "AWS", "Azure", "Docker", "Git",
        
        // Marketing & Business
        "Digital Marketing", "Content Creation", "SEO",
        "Social Media", "Email Marketing", "Data Analysis",
        "Market Research", "Campaign Management",
        
        // Project & Process
        "Agile Methodology", "Scrum", "Kanban",
        "Waterfall", "Product Development", "Requirements Gathering",
        "Stakeholder Management", "Process Improvement",
        
        // Creative
        "Graphic Design", "Branding", "Creative Direction",
        "Illustration", "Animation", "Video Editing", "Copywriting",
        
        // Industry Knowledge
        "Ecommerce", "Fintech", "Healthcare", "Education",
        "Real Estate", "Retail", "Hospitality"
      ];
      
      // Call the parse-cv function
      const { data, error } = await supabase.functions.invoke('parse-cv', {
        body: { fileUrl: cvUrl, requiredSkills: skillsToScan }
      });
      
      if (error) throw error;
      
      setDetectedSkills(data.matchedSkills || []);
      setHasScanned(true);
      
      const skillCount = data.matchedSkills ? data.matchedSkills.length : 0;
      toast({
        title: "CV Analysis Complete",
        description: skillCount > 0 
          ? `Found ${skillCount} skills in your CV.` 
          : "No skills were detected in your CV. Consider updating it with specific technical and professional skills.",
        variant: skillCount > 0 ? "default" : "destructive",
      });
    } catch (error: any) {
      console.error('Error scanning CV:', error);
      toast({
        variant: "destructive",
        title: "Error Analyzing CV",
        description: error.message || "Failed to scan your CV for skills. Please try again later.",
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">CV Skills Analysis</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={scanCV}
          disabled={scanning || !cvUrl}
          className="flex items-center gap-2"
        >
          {scanning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing CV...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Scan CV for Skills
            </>
          )}
        </Button>
      </div>
      
      {hasScanned && (
        <div className="mt-4">
          {detectedSkills.length > 0 ? (
            <>
              <p className="text-sm text-gray-600 mb-2">
                The following skills were detected in your CV:
              </p>
              <div className="flex flex-wrap gap-2">
                {detectedSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-[#FF69B4]/10 text-[#FF69B4] hover:bg-[#FF69B4]/20"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </>
          ) : (
            <div className="p-4 border border-amber-200 bg-amber-50 rounded-md">
              <p className="text-sm text-amber-800">
                No skills were detected in your CV. To improve your matches:
              </p>
              <div className="pl-5 mt-2 space-y-1">
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Include specific skills like "Web Design" or "Project Management" in your CV</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Make sure your CV is in a readable text format (not just images)</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Use complete terms rather than abbreviations</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>List skills clearly, ideally in a dedicated "Skills" section</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {!cvUrl && (
        <p className="text-sm text-amber-600">
          Please upload your CV first before scanning for skills.
        </p>
      )}
    </div>
  );
};
