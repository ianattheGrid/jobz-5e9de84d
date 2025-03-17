
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CVSkillsScannerProps {
  cvUrl: string | null;
}

export const CVSkillsScanner = ({ cvUrl }: CVSkillsScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [detectedSkills, setDetectedSkills] = useState<string[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
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
      setScanError(null);
      
      // Extended skill list with web design, app development and more technical skills
      const skillsToScan = [
        // Web Design & Development
        "HTML", "CSS", "JavaScript", "TypeScript", "React", "Angular", 
        "Vue", "Web Design", "Responsive Design", "Web Development",
        "UI Design", "UX Design", "WordPress", "Webflow", "Figma",
        "Adobe XD", "Sketch", "InVision", "Prototyping",
        
        // Mobile & App Development
        "Mobile Development", "iOS Development", "Android Development", 
        "Swift", "Kotlin", "React Native", "Flutter", "App Development",
        "Hybrid Apps", "Mobile Apps", "Cross Platform", "Mobile UI",
        
        // Backend
        "Node.js", "Express", "Django", "Flask", "Ruby on Rails",
        "PHP", "Laravel", "ASP.NET", "Spring Boot", "Java", 
        "C#", "Python", "Go", "Rust", "API Development", "GraphQL", "REST API",
        
        // Databases
        "SQL", "MySQL", "PostgreSQL", "MongoDB", "NoSQL", 
        "Firebase", "Redis", "Database Design", "ORM",
        
        // DevOps & Infrastructure
        "AWS", "Azure", "Google Cloud", "DevOps", "Docker", "Kubernetes",
        "CI/CD", "Jenkins", "Git", "GitHub", "GitLab", "Bitbucket",
        
        // Project Management & Professional
        "Agile", "Scrum", "Kanban", "Jira", "Project Management",
        "Team Leadership", "Communication", "Problem Solving",
        
        // Design & Creative
        "Graphic Design", "Photoshop", "Illustrator", "InDesign", 
        "After Effects", "UI/UX", "Animation", "Video Editing",
        "Content Creation", "Branding", 
        
        // Marketing & Analytics 
        "SEO", "Digital Marketing", "Google Analytics", "Social Media",
        "Content Strategy", "Email Marketing", "A/B Testing",
        
        // AI & Data
        "Machine Learning", "Data Science", "Data Analysis", 
        "Big Data", "Artificial Intelligence", "TensorFlow", "PyTorch"
      ];
      
      console.log("Starting CV scan with URL:", cvUrl);
      
      // Call the parse-cv function with additional debug info
      const { data, error } = await supabase.functions.invoke('parse-cv', {
        body: { 
          fileUrl: cvUrl, 
          requiredSkills: skillsToScan,
          debug: true
        }
      });
      
      if (error) throw error;
      
      console.log("Received scan results:", data);
      
      if (data.error) {
        setScanError(data.error);
        toast({
          variant: "destructive",
          title: "Error Scanning CV",
          description: data.error || "Failed to extract skills from your CV.",
        });
      } else {
        setDetectedSkills(data.matchedSkills || []);
        
        const skillCount = data.matchedSkills ? data.matchedSkills.length : 0;
        toast({
          title: "CV Analysis Complete",
          description: skillCount > 0 
            ? `Found ${skillCount} skills in your CV.` 
            : "No skills were detected in your CV. Consider updating it with specific technical and professional skills.",
          variant: skillCount > 0 ? "default" : "destructive",
        });
      }
      
      setHasScanned(true);
    } catch (error: any) {
      console.error('Error scanning CV:', error);
      setScanError(error.message || "Unknown error occurred");
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
      
      {hasScanned && !scanError && (
        <div className="mt-4">
          {detectedSkills.length > 0 ? (
            <div className="p-4 border border-green-200 bg-green-50 rounded-md">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-sm font-medium text-green-800">
                  {detectedSkills.length} skills detected in your CV
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                The following skills were identified:
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
            </div>
          ) : (
            <div className="p-4 border border-amber-200 bg-amber-50 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    No skills were detected in your CV
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-amber-700">
                    <p className="font-medium">To improve your matches:</p>
                    <div className="ml-1 space-y-1">
                      <p>• Include specific skills like "Web Design" or "App Development" in your CV</p>
                      <p>• Make sure your CV is in a readable text format (not just images)</p>
                      <p>• Use complete terms rather than abbreviations</p>
                      <p>• List skills clearly, ideally in a dedicated "Skills" section</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {scanError && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Error scanning CV</p>
              <p className="text-sm text-red-700 mt-1">{scanError}</p>
              <p className="text-sm text-red-600 mt-2">
                Try the following:
              </p>
              <ul className="mt-1 list-disc list-inside text-sm text-red-600 space-y-1">
                <li>Upload your CV again in PDF format</li>
                <li>Ensure your PDF contains extractable text rather than just images</li>
                <li>Try converting your CV to a different format if possible</li>
              </ul>
            </div>
          </div>
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
