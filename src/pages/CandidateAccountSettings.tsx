import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteAccountDialog } from "@/components/employer/DeleteAccountDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import NavBar from "@/components/NavBar";
import { LayoutDashboard } from "lucide-react";

const CandidateAccountSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your password has been updated.",
      });
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
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Account Settings</h1>
          <Button
            onClick={() => navigate('/candidate/dashboard')}
            className="text-white"
            variant="default"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>
        
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Account Info */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your login details and account management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900 p-2 bg-gray-50 rounded-md">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="max-w-md bg-gray-50"
                  />
                </div>
                <Button 
                  onClick={handlePasswordChange} 
                  disabled={!newPassword || loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>Permanently delete your account and all associated data</CardDescription>
            </CardHeader>
            <CardContent>
              <DeleteAccountDialog />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateAccountSettings;
