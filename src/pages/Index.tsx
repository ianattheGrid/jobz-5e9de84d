import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const userType = session.user.user_metadata.user_type;
        
        switch (userType) {
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
            // If user type is not recognized, show them the jobs page
            navigate('/jobs');
        }
      } else {
        // If not authenticated, show them the jobs page
        navigate('/jobs');
      }
    };

    checkUserAndRedirect();
  }, [navigate]);

  // Show a loading state while checking authentication
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800"></div>
    </div>
  );
}