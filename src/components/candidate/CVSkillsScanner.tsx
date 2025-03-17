import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search } from "lucide-react";

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
      
      // Get common skills to scan for
      const commonSkills = [
        // Programming Languages
        "JavaScript", "TypeScript", "Python", "Java", "C#", "PHP", "Ruby", "Go", "Swift", "Kotlin",
        "C++", "C", "Rust", "Scala", "Perl", "Shell", "SQL", "HTML", "CSS", "SASS", "LESS",
        
        // Frameworks & Libraries
        "React", "Angular", "Vue", "Express", "Django", "Flask", "Spring", "Laravel", "Node.js", 
        "jQuery", "Bootstrap", "Tailwind", ".NET", "ASP.NET", "Rails", "Symfony",
        
        // Databases
        "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Oracle", "SQL Server", "Redis", "Cassandra", 
        "DynamoDB", "Firebase", "Firestore", "ElasticSearch", "MariaDB",
        
        // Cloud & DevOps
        "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "CircleCI", "Travis CI",
        "GitHub Actions", "Terraform", "Ansible", "Puppet", "Chef", "Vagrant", "Prometheus", "Grafana",
        
        // Other Tech Skills
        "Git", "GraphQL", "REST API", "WebSockets", "Linux", "Unix", "Agile", "Scrum", "Jira",
        "CI/CD", "TDD", "BDD", "Microservices", "Machine Learning", "AI", "Data Analysis"
      ];
      
      // Call the parse-cv function
      const { data, error } = await supabase.functions.invoke('parse-cv', {
        body: { fileUrl: cvUrl, requiredSkills: commonSkills }
      });
      
      if (error) throw error;
      
      setDetectedSkills(data.matchedSkills || []);
      setHasScanned(true);
      
      toast({
        title: "CV Analysis Complete",
        description: `Found ${data.matchedSkills ? data.matchedSkills.length : 0} skills in your CV.`,
      });
    } catch (error: any) {
      console.error('Error scanning CV:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to scan your CV for skills.",
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
                  <span
                    key={index}
                    className="bg-[#FF69B4]/10 text-[#FF69B4] px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-600">
              No skills were detected in your CV. Try updating your CV with more specific technical skills.
            </p>
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
