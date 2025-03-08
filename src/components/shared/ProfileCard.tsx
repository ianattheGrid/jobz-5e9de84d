
import { FC } from 'react';

interface ProfileInfo {
  label: string;
  value: string;
}

interface ProfileCardProps {
  fullName: string;
  title: string;
  additionalInfo: ProfileInfo[];
}

export const ProfileCard: FC<ProfileCardProps> = ({
  fullName,
  title,
  additionalInfo,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{fullName}</h3>
        <p className="text-gray-600">{title}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {additionalInfo.map((info, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{info.label}</p>
              <p className="text-gray-900">{info.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
