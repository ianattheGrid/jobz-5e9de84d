
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Building2, 
  Search, 
  Calendar, 
  UserCircle,
  MessageSquare
} from "lucide-react";

export const DashboardMenu = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: "Post New Job",
      icon: <Briefcase className="h-6 w-6" />,
      path: "/employer/create-vacancy",
      description: "Create a new job posting"
    },
    {
      title: "Manage Jobs",
      icon: <Building2 className="h-6 w-6" />,
      path: "/employer/manage-jobs",
      description: "View and edit your job listings"
    },
    {
      title: "Search Candidates",
      icon: <Search className="h-6 w-6" />,
      path: "/employer/candidate-search",
      description: "Find potential candidates"
    },
    {
      title: "View Interviews",
      icon: <Calendar className="h-6 w-6" />,
      path: "/employer/interviews",
      description: "Manage scheduled interviews"
    },
    {
      title: "Profile Settings",
      icon: <UserCircle className="h-6 w-6" />,
      path: "/employer/profile",
      description: "Update your company profile"
    },
    {
      title: "Contact Us",
      icon: <MessageSquare className="h-6 w-6" />,
      path: "/employer/contact",
      description: "Get in touch with our support team"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {menuItems.map((item, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-auto p-6 flex flex-col items-center gap-4 bg-white hover:bg-red-50 transition-all duration-200 border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
          onClick={() => navigate(item.path)}
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

