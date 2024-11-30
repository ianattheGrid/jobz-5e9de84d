import { Briefcase, Building2, MapPin, DollarSign, Clock, Gift } from "lucide-react";
import { Card } from "./ui/card";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  type: string;
  candidateCommission?: string;
  referralCommission?: string;
  onSwipe: (direction: "left" | "right") => void;
}

const JobCard = ({ 
  title, 
  company, 
  location, 
  description, 
  salary, 
  type, 
  candidateCommission,
  referralCommission,
  onSwipe 
}: JobCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-xl transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <div className="flex items-center space-x-2 text-gray-600 mt-1">
              <Building2 className="w-4 h-4" />
              <span>{company}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>
          <Briefcase className="w-8 h-8 text-primary-DEFAULT" />
        </div>
        
        <div className="flex items-center space-x-4 text-gray-600">
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span>{salary}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{type}</span>
          </div>
        </div>
        
        {(candidateCommission || referralCommission) && (
          <div className="space-y-2 bg-primary-light/20 p-3 rounded-lg">
            <h4 className="font-medium flex items-center gap-2">
              <Gift className="w-4 h-4 text-primary-DEFAULT" />
              Commission Opportunities
            </h4>
            {candidateCommission && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Candidate Bonus:</span> {candidateCommission}
              </p>
            )}
            {referralCommission && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Referral Bonus:</span> {referralCommission}
              </p>
            )}
          </div>
        )}
        
        <p className="text-gray-600">{description}</p>
        
        <div className="flex justify-between pt-4">
          <button
            onClick={() => onSwipe("left")}
            className="px-6 py-2 rounded-full border-2 border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
          >
            Pass
          </button>
          <button
            onClick={() => onSwipe("right")}
            className="px-6 py-2 rounded-full bg-primary-DEFAULT text-white hover:bg-primary-dark transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;