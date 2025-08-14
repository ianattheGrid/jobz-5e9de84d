
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
  console.log("Company logo URL:", profile.company_logo_url);
  console.log("Full profile object:", profile);

  return (
    <>
      <div className="relative">
        <div className="h-40 rounded-b-xl bg-gradient-to-br from-[#0b1437] via-[#14245a] to-[#1f2d72]"></div>
        <div className="absolute -bottom-16 left-8 ring-4 ring-white rounded-lg overflow-hidden">
          {profile.company_logo_url ? (
            <div 
              style={{
                width: '128px',
                height: '128px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '4px solid white',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onClick={() => window.open(profile.company_logo_url, '_blank')}
              title="Click to view logo"
            >
              <img 
                src={profile.company_logo_url}
                alt={`${profile.company_name} logo`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'none',
                  transform: 'none',
                  mixBlendMode: 'normal',
                  opacity: '1',
                  position: 'absolute',
                  top: '0',
                  left: '0'
                }}
              />
            </div>
          ) : (
            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
              <Building2 className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-20 px-8 pb-8">
        {/* Company name and employee count on the same line */}
        <div className="flex items-center justify-between mb-4">
          <h1 
            style={{
              color: '#000000',
              fontSize: '32px',
              fontWeight: 'bold',
              margin: '0'
            } as React.CSSProperties}
          >
            {profile.company_name || 'theGrid'}
          </h1>
          
          <div className="inline-flex items-center px-3 py-1 bg-gray-50 rounded-md border border-gray-300">
            <Users className="h-4 w-4 mr-2 text-gray-600" />
            <span className="text-navy font-medium">
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
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors hover:underline"
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
