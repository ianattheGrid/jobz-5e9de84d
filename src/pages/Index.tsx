import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User, Users } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Get all profiles for this user's email
        const email = session.user.email;
        const [
          { data: employerProfile },
          { data: candidateProfile },
          { data: vrProfile }
        ] = await Promise.all([
          supabase.from('employer_profiles').select('id').eq('id', session.user.id).single(),
          supabase.from('candidate_profiles').select('id').eq('id', session.user.id).single(),
          supabase.from('virtual_recruiter_profiles').select('id').eq('id', session.user.id).single()
        ]);

        const roles = [];
        if (employerProfile) roles.push('employer');
        if (candidateProfile) roles.push('candidate');
        if (vrProfile) roles.push('vr');

        if (roles.length === 0) {
          navigate('/jobs');
        } else if (roles.length === 1) {
          // If user has only one role, redirect directly
          switch (roles[0]) {
            case 'vr':
              navigate('/vr/dashboard');
              break;
            case 'employer':
              navigate('/employer/dashboard');
              break;
            case 'candidate':
              navigate('/candidate/dashboard');
              break;
            default:
              navigate('/jobs');
          }
        } else {
          // If user has multiple roles, show selection screen
          setUserRoles(roles);
          setLoading(false);
        }
      } else {
        // If not authenticated, show them the jobs page
        navigate('/jobs');
      }
    };

    checkUserAndRedirect();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800"></div>
      </div>
    );
  }

  const roleCards = {
    employer: {
      title: "Employer Dashboard",
      description: "Manage your job listings and view applications",
      icon: <Building2 className="h-12 w-12 text-red-800" />,
      path: "/employer/dashboard"
    },
    candidate: {
      title: "Candidate Dashboard",
      description: "View job matches and manage your applications",
      icon: <User className="h-12 w-12 text-red-800" />,
      path: "/candidate/dashboard"
    },
    vr: {
      title: "Virtual Recruiter Dashboard",
      description: "Manage your recommendations and referrals",
      icon: <Users className="h-12 w-12 text-red-800" />,
      path: "/vr/dashboard"
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Select Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userRoles.map((role) => (
            <Card key={role} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {roleCards[role as keyof typeof roleCards].icon}
                </div>
                <CardTitle>{roleCards[role as keyof typeof roleCards].title}</CardTitle>
                <CardDescription>
                  {roleCards[role as keyof typeof roleCards].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-red-800 hover:bg-red-900"
                  onClick={() => navigate(roleCards[role as keyof typeof roleCards].path)}
                >
                  Access Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}