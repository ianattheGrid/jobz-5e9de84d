import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { NotificationSettings } from "@/components/candidate/NotificationSettings";
import { PersonalizedJobRecommendations } from "@/components/candidate/PersonalizedJobRecommendations";
import ExternalJobsWidget from "@/components/candidate/ExternalJobsWidget";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { 
  UserCircle,
  Briefcase,
  Database,
  Settings,
  Calendar,
  Sparkles
} from "lucide-react";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  
  console.log('[CandidateDashboard] Rendering MINIMAL test version');

  const menuItems = [
    {
      title: "Update Profile",
      icon: <UserCircle className="h-6 w-6" />,
      path: "/candidate/profile",
      description: "Edit your professional details",
      helpTitle: "Your Profile",
      helpText: "Complete your profile to get matched with employers. Add your skills, experience, and what makes you unique. The more complete your profile, the better your job matches!"
    },
    {
      title: "My Applications",
      icon: <Database className="h-6 w-6" />,
      path: "/candidate/applications",
      description: "Track your job applications",
      helpTitle: "Applications",
      helpText: "Track the status of jobs you've applied to. See when employers view your application and receive responses directly here."
    },
    {
      title: "My Interviews",
      icon: <Calendar className="h-6 w-6" />,
      path: "/candidate/interviews",
      description: "View and schedule interviews",
      helpTitle: "Interview Management",
      helpText: "View upcoming interview invitations from employers. Schedule times that work for you and prepare for your next opportunity."
    },
    {
      title: "Account Settings",
      icon: <Settings className="h-6 w-6" />,
      path: "/candidate/settings",
      description: "Manage your account",
      helpTitle: "Settings",
      helpText: "Manage your account preferences, notification settings, privacy options, and update your login credentials."
    },
    {
      title: "Webby AI Co-pilot",
      icon: <Sparkles className="h-6 w-6" />,
      path: "/webby-candidate",
      description: "Get AI-powered job matching & advice",
      helpTitle: "AI Assistant",
      helpText: "Get personalized job recommendations and career advice from our AI assistant. Webby can help you find roles that match your skills and aspirations."
    }
  ];

  return (
    <CosmicBackground mode="light">
      <NavBar />
      <div className="container mx-auto py-8 px-4 pt-20">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent drop-shadow-sm">
            Welcome to Your Dashboard
          </h1>
          <p className="text-foreground/70 text-lg">Discover opportunities and manage your journey</p>
        </div>
        
        {/* Notification Settings */}
        <div className="mb-8">
          <NotificationSettings />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Update Profile */}
          <DashboardCard 
            onClick={() => navigate("/candidate/profile")}
            helpTitle={menuItems[0].helpTitle}
            helpText={menuItems[0].helpText}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <UserCircle className="h-6 w-6 text-primary group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)] transition-all" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Update Profile</h3>
                <p className="text-sm text-muted-foreground">Edit your professional details</p>
              </div>
            </div>
          </DashboardCard>

          {/* Personalized Job Recommendations */}
          <PersonalizedJobRecommendations />

          {/* External Jobs Widget */}
          <ExternalJobsWidget />

          {/* Remaining menu items */}
          {menuItems.slice(1).map((item, index) => (
            <DashboardCard 
              key={index} 
              onClick={() => navigate(item.path)}
              helpTitle={item.helpTitle}
              helpText={item.helpText}
            >
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
      </div>
    </CosmicBackground>
  );
};

export default CandidateDashboard;
