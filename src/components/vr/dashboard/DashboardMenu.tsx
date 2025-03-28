
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  UserPlus, 
  Users, 
  BarChart3, 
  Mail,
  UserCircle,
  CreditCard
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
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {menuItems.map((item, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-auto p-6 flex flex-col items-center gap-4 bg-white hover:bg-red-50 transition-all duration-200 border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
          onClick={() => {
            console.log('Navigating to:', item.path);
            navigate(item.path);
          }}
        >
          <div className="text-red-800">{item.icon}</div>
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2 text-red-800">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </Button>
      ))}
    </div>
  );
};
