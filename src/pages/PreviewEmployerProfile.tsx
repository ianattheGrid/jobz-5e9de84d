
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployerProfile } from "@/hooks/useEmployerProfile";
import ViewEmployerProfile from "./ViewEmployerProfile";

export default function PreviewEmployerProfile() {
  const { profile, loading } = useEmployerProfile();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !profile.id) {
      navigate("/employer/profile");
    }
  }, [loading, profile, navigate]);

  if (loading || !profile.id) {
    return null;
  }

  return <ViewEmployerProfile previewMode={true} employerId={profile.id} />;
}
