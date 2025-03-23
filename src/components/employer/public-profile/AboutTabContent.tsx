
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Landmark } from "lucide-react";
import type { EmployerProfile } from "@/types/employer";

interface AboutTabContentProps {
  profile: EmployerProfile;
}

export const AboutTabContent = ({ profile }: AboutTabContentProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">About {profile.company_name}</h3>
          
          <div className="prose max-w-none">
            <p className="text-gray-700">
              {profile.company_description || "This company has not provided a detailed description yet."}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {(profile.office_amenities || profile.nearby_amenities) && (
        <Card className="bg-white">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Workplace</h3>
            
            {profile.office_amenities && (
              <div className="mb-6">
                <h4 className="flex items-center text-lg font-medium mb-3 text-gray-800">
                  <Coffee className="h-5 w-5 mr-2 text-pink-500" />
                  Office Amenities
                </h4>
                <p className="text-gray-700">{profile.office_amenities}</p>
              </div>
            )}
            
            {profile.nearby_amenities && (
              <div>
                <h4 className="flex items-center text-lg font-medium mb-3 text-gray-800">
                  <Landmark className="h-5 w-5 mr-2 text-pink-500" />
                  Nearby Amenities
                </h4>
                <p className="text-gray-700">{profile.nearby_amenities}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <Card className="bg-white">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Contact Information</h3>
          
          <dl className="divide-y divide-gray-100">
            {profile.full_name && (
              <div className="px-4 py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                <dd className="text-sm text-gray-900 col-span-2">{profile.full_name}</dd>
              </div>
            )}
            
            {profile.job_title && (
              <div className="px-4 py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="text-sm text-gray-900 col-span-2">{profile.job_title}</dd>
              </div>
            )}
            
            {profile.company_website && (
              <div className="px-4 py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Website</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  <a 
                    href={profile.company_website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:underline"
                  >
                    {profile.company_website}
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
