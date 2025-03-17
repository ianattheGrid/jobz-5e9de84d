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
      
      // Updated skill list for more accurate matching - focused on technical skills
      // with longer, more specific names to avoid false positives
      const skillsToScan = [
        // Programming Languages - more specific terms
        "JavaScript", "TypeScript", "Python", "Java", "C# .NET", "PHP", "Ruby on Rails", 
        "Swift", "Kotlin", "C++", "Rust", "Scala", "Perl", "PowerShell", "SQL Server",
        "PostgreSQL", "HTML5", "CSS3", "SASS", "LESS",
        
        // Frameworks & Libraries - using more specific full names
        "React.js", "Angular.js", "Vue.js", "Next.js", "Express.js", "Django", 
        "Flask", "Spring Boot", "Laravel Framework", "Node.js", 
        "jQuery", "Bootstrap CSS", "Tailwind CSS", "ASP.NET MVC", "Ruby on Rails", "Symfony",
        
        // Databases - full names
        "MySQL Database", "PostgreSQL", "MongoDB", "SQLite", "Oracle Database", "Microsoft SQL Server", 
        "Redis", "Apache Cassandra", "Amazon DynamoDB", "Google Firebase", "Firestore",
        "Elasticsearch", "MariaDB",
        
        // Cloud & DevOps - longer specific terms
        "Amazon Web Services", "Microsoft Azure", "Google Cloud Platform", "Docker Containers", 
        "Kubernetes Orchestration", "Jenkins Pipeline", "CircleCI", "Travis CI",
        "GitHub Actions", "Terraform", "Ansible", "Chef", "Prometheus Monitoring", "Grafana",
        
        // Other Tech Skills - making terms more specific
        "Git Version Control", "GraphQL API", "RESTful API Design", "WebSockets Protocol", "Linux Administration", 
        "Agile Methodology", "Scrum Framework", "Test-Driven Development", "Microservices Architecture", 
        "Machine Learning", "Artificial Intelligence"
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
          : "No skills were detected in your CV. Consider updating it with specific technical skills.",
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
                  <li>Include specific technical skills and technologies in your CV</li> 
                  <li>Make sure your CV is in a readable text format (not just images)</li>
                  <li>Use complete terms like "JavaScript" rather than abbreviations like "JS"</li>
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
