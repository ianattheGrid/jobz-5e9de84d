
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, Building2, Users, Globe, Mail, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployerJobsList } from "@/components/employer/public-profile/EmployerJobsList";
import { CompanyMediaSection } from "@/components/employer/public-profile/CompanyMediaSection";
import { CompanyCultureSection } from "@/components/employer/public-profile/CompanyCultureSection";
import { EmployerProfile } from "@/types/employer";

const ViewEmployerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  
  useEffect(() => {
    const fetchEmployerProfile = async () => {
      try {
        if (!id) return;
        
        const { data, error } = await supabase
          .from('employer_profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        if (data) {
          setProfile(data);
        }
      } catch (error: any) {
        console.error('Error fetching employer profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load employer profile",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployerProfile();
  }, [id, toast]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Employer not found</h2>
          <p className="mt-2 text-gray-600">The employer profile you're looking for doesn't exist.</p>
          <Link to="/jobs">
            <Button variant="outline" className="mt-4">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-start mb-6">
        <Link to="/jobs">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Jobs
          </Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with company logo and basic info */}
        <div className="relative">
          <div className="h-40 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
          <div className="absolute -bottom-16 left-8 ring-4 ring-white rounded-lg overflow-hidden">
            {profile.company_logo_url ? (
              <img 
                src={profile.company_logo_url} 
                alt={`${profile.company_name} logo`} 
                className="w-32 h-32 object-cover bg-white"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>
        
        {/* Company details */}
        <div className="pt-20 px-8 pb-8">
          <h1 className="text-3xl font-bold text-gray-900">{profile.company_name}</h1>
          
          <div className="mt-4 flex flex-wrap gap-y-2 gap-x-6">
            {profile.company_website && (
              <a 
                href={profile.company_website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-600 hover:underline"
              >
                <Globe className="h-4 w-4" />
                Website
              </a>
            )}
            
            {profile.company_size && (
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4" />
                {profile.company_size} employees
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {profile.is_sme ? (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">SME</Badge>
              ) : (
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Enterprise</Badge>
              )}
            </div>
          </div>
          
          {/* Tabs for different sections */}
          <div className="mt-8">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="jobs">Current Openings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-6">
                <CompanyCultureSection employerId={profile.id} />
              </TabsContent>
              
              <TabsContent value="media" className="mt-6">
                <CompanyMediaSection employerId={profile.id} />
              </TabsContent>
              
              <TabsContent value="jobs" className="mt-6">
                <EmployerJobsList employerId={profile.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployerProfile;
