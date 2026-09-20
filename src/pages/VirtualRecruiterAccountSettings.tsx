import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteAccountDialog } from "@/components/shared/DeleteAccountDialog";
import { useAuth } from "@/hooks/useAuth";
import NavBar from "@/components/NavBar";
import { LayoutDashboard } from "lucide-react";

const VirtualRecruiterAccountSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Success", description: "Your password has been updated." });
      setNewPassword("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-20 max-w-2xl">
        <div className="flex justify-between items-start gap-4 mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <Button onClick={() => navigate("/vr/dashboard")} variant="secondary">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
              <CardDescription>The address you sign in with</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{user?.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change password</CardTitle>
              <CardDescription>Choose a new password for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button onClick={handlePasswordChange} disabled={loading || newPassword.length < 6}>
                {loading ? "Updating..." : "Update password"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Close your account</CardTitle>
              <CardDescription>
                This permanently removes your connector account and all of your referrals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DeleteAccountDialog>
                <Button variant="destructive">Delete Account</Button>
              </DeleteAccountDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VirtualRecruiterAccountSettings;
