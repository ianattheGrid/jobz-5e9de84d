import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import { 
  UserCircle,
  Briefcase,
  Database,
  Settings,
  Calendar,
  MessageSquare
} from "lucide-react";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  
  console.log('[CandidateDashboard] Rendering MINIMAL test version');

  const menuItems = [
    {
      title: "Update Profile",
      icon: <UserCircle className="h-6 w-6" />,
      path: "/candidate/profile",
      description: "Edit your professional details"
    },
    {
      title: "View Jobs", 
      icon: <Briefcase className="h-6 w-6" />,
      path: "/jobs",
      description: "Browse available positions"
    },
    {
      title: "My Applications",
      icon: <Database className="h-6 w-6" />,
      path: "/candidate/applications",
      description: "Track your job applications"
    },
    {
      title: "My Interviews",
      icon: <Calendar className="h-6 w-6" />,
      path: "/candidate/interviews",
      description: "View and schedule interviews"
    },
    {
      title: "Account Settings",
      icon: <Settings className="h-6 w-6" />,
      path: "/candidate/settings",
      description: "Manage your account"
    },
    {
      title: "AI Assistant",
      icon: <MessageSquare className="h-6 w-6" />,
      path: "/candidate/chat",
      description: "Get AI-powered career advice"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-600 mb-8">Manage your job search and applications</p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-4 bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
              onClick={() => navigate(item.path)}
            >
              <div className="text-[#FF69B4]">{item.icon}</div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;