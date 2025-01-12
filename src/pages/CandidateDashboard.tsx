import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import NavBar from "@/components/NavBar";
import { 
  UserCircle,
  Briefcase,
  MessageSquare,
  Settings,
  Database,
  Mail
} from "lucide-react";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.user_metadata.user_type !== 'candidate') {
        navigate('/candidate/signin');
        return;
      }

      // Fetch candidate profile
      const { data: profile } = await supabase
        .from('candidate_profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name);
      }

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
      path: "#",
      description: "Track your job applications"
    },
    {
      title: "Messages",
      icon: <MessageSquare className="h-6 w-6" />,
      path: "#",
      description: "View recruiter messages"
    },
    {
      title: "Account Settings",
      icon: <Settings className="h-6 w-6" />,
      path: "#",
      description: "Manage your account"
    },
    {
      title: "Contact AI Support",
      icon: <Mail className="h-6 w-6" />,
      path: "#",
      description: "Get in touch with our AI support team"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-bold mb-2 text-red-800">
          Welcome{fullName ? `, ${fullName}` : ''}
        </h1>
        <p className="text-gray-600 mb-8">Manage your job search and applications</p>
        
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
      </div>
    </div>
  );
};

export default CandidateDashboard;