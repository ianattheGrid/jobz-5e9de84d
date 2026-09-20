import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { rememberInviteCode } from "@/utils/referral/inviteStorage";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import NavBar from "@/components/NavBar";

/**
 * Landing page for an invite link. Remembers the code, then sends the visitor
 * to the normal signup chooser so they pick candidate / employer / Connector.
 */
const JoinWithInvite = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) rememberInviteCode(code);
    const timer = setTimeout(() => navigate("/signup", { replace: true }), 900);
    return () => clearTimeout(timer);
  }, [code, navigate]);

  return (
    <CosmicBackground mode="full">
      <NavBar />
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-white">You've been invited to Jobz</h1>
        <p className="mt-3 text-white/80">
          Taking you to signup — pick whether you're looking for work, hiring, or referring people.
        </p>
      </div>
    </CosmicBackground>
  );
};

export default JoinWithInvite;
