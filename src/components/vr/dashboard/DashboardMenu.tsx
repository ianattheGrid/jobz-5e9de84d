
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  UserPlus, 
  Users, 
  BarChart3, 
  Mail,
  UserCircle,
  CreditCard,
  FileText
} from "lucide-react";

export const DashboardMenu = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: "Refer Candidates",
      icon: <UserPlus className="h-6 w-6" />,
      path: "/vr/recommendations",
      description: "Refer new candidates to jobs"
    },
    {
      title: "My Referrals",
      icon: <Users className="h-6 w-6" />,
      path: "/vr/referrals",
      description: "View your candidate referrals"
    },
    {
      title: "Performance",
      icon: <BarChart3 className="h-6 w-6" />,
      path: "/vr/performance",
      description: "Check your performance metrics"
    },
    {
      title: "Messages",
      icon: <Mail className="h-6 w-6" />,
      path: "/vr/messages",
      description: "Candidate and system messages"
    },
    {
      title: "Profile Settings",
      icon: <UserCircle className="h-6 w-6" />,
      path: "/vr/profile",
      description: "Update your profile information"
    },
    {
      title: "Payment Details",
      icon: <CreditCard className="h-6 w-6" />,
      path: "/vr/payments",
      description: "Manage your payment information"
    },
    {
      title: "Recommendations",
      icon: <FileText className="h-6 w-6" />,
      path: "/vr/recommendations",
      description: "Submit candidate recommendations"
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {menuItems.slice(0, 4).map((item, index) => (
        <div key={index} className="text-center">
          <Button
            variant="outline"
            className="flex flex-col items-center p-6 h-28 w-28 rounded-md hover:bg-red-50 transition-all duration-200 border border-gray-200"
            onClick={() => {
              console.log('Navigating to:', item.path);
              navigate(item.path);
            }}
          >
            <div className="text-red-800 mb-2">{item.icon}</div>
            <div className="text-center">
              <p className="text-sm text-red-800 font-medium">{item.title}</p>
            </div>
          </Button>
        </div>
      ))}
    </div>
  );
};
