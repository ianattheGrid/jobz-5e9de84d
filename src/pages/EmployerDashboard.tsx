import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BonusNegotiations from "@/components/employer/BonusNegotiations";
import { 
  Briefcase, 
  Building2, 
  Search, 
  Calendar, 
  UserCircle,
  MessageSquare,
  PoundSterling
} from "lucide-react";
import NavBar from "@/components/NavBar";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.user_metadata.user_type !== 'employer') {
        navigate('/employer/signin');
        return;
      }
      setUserId(session.user.id);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while checking authentication",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800"></div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-800">Employer Dashboard</h1>
        
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

        {userId && (
          <div className="mt-8">
            <BonusNegotiations employerId={userId} />
          </div>
        )}
      </div>
    </>
  );
};

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
    path: "#",
    description: "Get in touch with our support team"
  }
];

export default EmployerDashboard;