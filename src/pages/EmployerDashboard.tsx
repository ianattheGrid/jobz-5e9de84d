
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import BonusNegotiations from "@/components/employer/BonusNegotiations";
import { BonusPaymentsSection } from "@/components/employer/BonusPaymentsSection";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Briefcase, Building2, Search, Calendar, UserCircle, MessageSquare, Sparkles } from "lucide-react";


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
      const { data: profile } = await supabase.from('employer_profiles').select('company_name').eq('id', session.user.id).maybeSingle();
      if (profile) {
        setCompanyName(profile.company_name);
      } else {
        // Create a new profile if none exists
        const { error: createError } = await supabase.from('employer_profiles').insert([{
          id: session.user.id,
          company_name: "",
          full_name: session.user.user_metadata.full_name || "",
          job_title: ""
        }]);
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
        description: "An error occurred while checking authentication"
      });
    }
  };

  const checkBonusEligibility = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Check if employer has created at least one job posting
      const { data: jobPostings } = await supabase.from('jobs').select('id').eq('employer_id', session.user.id);

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
      title: "Savings & Bonus calculators",
      icon: <MessageSquare className="h-6 w-6" />,
      path: "/employer/calculator",
      description: "Calculate recruitment costs and bonus structures"
    },
    {
      title: "Webby AI Co-pilot",
      icon: <Sparkles className="h-6 w-6" />,
      path: "/webby-employer",
      description: "AI-powered candidate matching & recruitment"
    }
  ];

  return (
    <CosmicBackground mode="light">
      <NavBar />
      <div className="container mx-auto px-4 pt-20">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent drop-shadow-sm">
            Welcome{companyName ? `, ${companyName}` : ''}
          </h1>
          <p className="text-foreground/70 text-lg">Manage your talent pipeline with ease</p>
        </div>
        
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, index) => (
            <DashboardCard key={index} onClick={() => navigate(item.path)}>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <div className="text-primary group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)] transition-all">
                    {item.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>

        {showBonus && userId && (
          <div className="mt-8 space-y-8">
            <BonusNegotiations employerId={userId} />
            <BonusPaymentsSection employerId={userId} />
          </div>
        )}
      </div>
    </CosmicBackground>
  );
};

export default EmployerDashboard;
