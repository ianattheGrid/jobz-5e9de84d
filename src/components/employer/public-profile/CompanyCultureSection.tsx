
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CompanyCultureSectionProps {
  employerId: string;
}

interface CompanyCulture {
  id: string;
  employer_id: string;
  description: string;
  mission_statement: string;
  values: string[];
  created_at: string;
  updated_at: string;
}

export const CompanyCultureSection = ({ employerId }: CompanyCultureSectionProps) => {
  const [loading, setLoading] = useState(true);
  const [culture, setCulture] = useState<CompanyCulture | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employer profile for basic information
        const { data: profileData } = await supabase
          .from('employer_profiles')
          .select('*')
          .eq('id', employerId)
          .single();
        
        if (profileData) {
          setProfileData(profileData);
        }
        
        // For now, we'll use a placeholder since the company_culture table doesn't exist yet
        // In the future, you would fetch from the company_culture table
        setCulture({
          id: "placeholder",
          employer_id: employerId,
          description: "This company has not provided a detailed description yet.",
          mission_statement: "",
          values: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('Error fetching company culture:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [employerId]);
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">About {profileData?.company_name}</h3>
          
          <div className="prose max-w-none">
            <p className="text-gray-700">
              {culture?.description || "This company has not provided a detailed description yet."}
            </p>
            
            {culture?.mission_statement && (
              <>
                <h4 className="text-lg font-medium mt-4 mb-2">Our Mission</h4>
                <p className="text-gray-700">{culture.mission_statement}</p>
              </>
            )}
            
            {culture?.values && culture.values.length > 0 && (
              <>
                <h4 className="text-lg font-medium mt-4 mb-2">Our Values</h4>
                <ul className="list-disc pl-5">
                  {culture.values.map((value, index) => (
                    <li key={index} className="text-gray-700">{value}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
          
          <dl className="divide-y divide-gray-100">
            {profileData?.full_name && (
              <div className="px-4 py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                <dd className="text-sm text-gray-900 col-span-2">{profileData.full_name}</dd>
              </div>
            )}
            
            {profileData?.job_title && (
              <div className="px-4 py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="text-sm text-gray-900 col-span-2">{profileData.job_title}</dd>
              </div>
            )}
            
            {profileData?.company_website && (
              <div className="px-4 py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Website</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  <a 
                    href={profileData.company_website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:underline"
                  >
                    {profileData.company_website}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};
