
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import BonusNegotiations from "@/components/employer/BonusNegotiations";
import { 
  Briefcase, 
  Building2, 
  Search, 
  Calendar, 
  UserCircle,
  MessageSquare
} from "lucide-react";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [showBonus, setShowBonus] = useState(false);

  useEffect(() => {
    checkUser();
    checkBonusEligibility();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.user_metadata.user_type !== 'employer') {
        navigate('/employer/signin');
        return;
      }
      setUserId(session.user.id);

      // Fetch employer profile
      const { data: profile } = await supabase
        .from('employer_profiles')
        .select('company_name')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profile) {
        setCompanyName(profile.company_name);
      } else {
        // Create a new profile if none exists
        const { error: createError } = await supabase
          .from('employer_profiles')
          .insert([
            {
              id: session.user.id,
              company_name: "",
              full_name: session.user.user_metadata.full_name || "",
              job_title: ""
            }
          ]);

        if (createError) {
          console.error('Error creating profile:', createError);
          return;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while checking authentication",
      });
    }
  };

  const checkBonusEligibility = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Check if employer has created at least one job posting
      const { data: jobPostings } = await supabase
        .from('jobs')
        .select('id')
        .eq('employer_id', session.user.id);

      // Only show bonus section if employer has posted jobs
      setShowBonus(jobPostings && jobPostings.length > 0);
    } catch (error) {
      console.error('Error checking bonus eligibility:', error);
    }
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

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 pt-20">
        <h1 className="text-3xl font-bold mb-2 text-primary">
          Welcome{companyName ? `, ${companyName}` : ''}
        </h1>
        <p className="text-white mb-8">Manage your job postings and candidates</p>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-4 bg-white hover:bg-red-50 transition-all duration-200 border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
              onClick={() => navigate(item.path)}
            >
              <div className="text-primary">{item.icon}</div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2 text-primary">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </Button>
          ))}
        </div>

        {showBonus && userId && (
          <div className="mt-8">
            <BonusNegotiations employerId={userId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
