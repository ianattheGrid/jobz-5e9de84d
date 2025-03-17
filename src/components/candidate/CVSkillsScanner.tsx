
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
      
      // Balanced skill list mixing technical and professional skills
      const skillsToScan = [
        // Technical Skills - Programming Languages
        "JavaScript", "TypeScript", "Python", "Java", "C# .NET", "PHP", "Ruby on Rails", 
        "Swift", "Kotlin", "C++", "SQL Database",
        
        // Technical Skills - Frameworks & Tools
        "React.js", "Angular.js", "Node.js", "Docker Containers", 
        "Cloud Computing", "Data Analysis", "AWS", "Microsoft Azure",
        
        // Professional Skills
        "Project Management", "Team Leadership", "Strategic Planning",
        "Business Analysis", "Agile Methodology", "Scrum Framework",
        "Stakeholder Management", "Client Relations", "Requirements Gathering",
        
        // Soft Skills & Management
        "Communication Skills", "Problem Solving", "Critical Thinking",
        "Time Management", "Presentation Skills", "Negotiation",
        "Change Management", "Budget Management", "Resource Allocation",
        
        // Industry Knowledge
        "Digital Marketing", "Financial Analysis", "Human Resources",
        "Supply Chain Management", "Quality Assurance", "Research Methods",
        "Customer Experience", "Product Development", "Risk Management",
        
        // Business Tools
        "Microsoft Office", "Google Workspace", "Salesforce", 
        "JIRA Project Management", "Power BI", "Tableau Dashboard",
        
        // Creative Skills
        "Content Creation", "UI/UX Design", "Graphic Design",
        "Copywriting", "Video Production"
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
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Include specific technical skills and professional competencies in your CV</li> 
                  <li>Make sure your CV is in a readable text format (not just images)</li>
                  <li>Use complete terms like "Project Management" rather than abbreviations</li>
                  <li>List skills clearly, ideally in a dedicated "Skills" section</li>
                </ul>
              </p>
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
