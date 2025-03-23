
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Users } from "lucide-react";
import type { EmployerProfile } from "@/types/employer";
import { companySizeOptions } from "@/config/company-size";

interface EmployerProfileHeaderProps {
  profile: EmployerProfile;
}

export const EmployerProfileHeader = ({ profile }: EmployerProfileHeaderProps) => {
  const getCompanySizeLabel = (size: number | null | undefined) => {
    if (!size) return "Unknown";
    const option = companySizeOptions.find(opt => opt.value === size);
    return option ? option.label : "Unknown";
  };

  // For debugging
  console.log("Company size:", profile.company_size);
  console.log("Company size label:", getCompanySizeLabel(profile.company_size));

  return (
    <>
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
      
      <div className="pt-20 px-8 pb-8">
        <h1 className="text-3xl font-bold text-gray-900">{profile.company_name}</h1>
        
        {/* Always render the company size section, but with a fallback */}
        <div className="mt-2 mb-4">
          <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-md">
            <Users className="h-4 w-4 mr-2 text-gray-600" />
            <span className="text-gray-900 font-medium">
              {getCompanySizeLabel(profile.company_size)}
            </span>
          </div>
        </div>
        
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
        </div>
      </div>
    </>
  );
};
