import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmail } from "@/utils/auth/signInWithEmail";

const AdminSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkRecoveryMode = async () => {
      // Check URL hash for recovery parameters
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hasRecoveryType = hashParams.get('type') === 'recovery';
      const hasAccessToken = hashParams.has('access_token');
      
      // Check sessionStorage for recovery flag
      const isRecoverySession = sessionStorage.getItem('password_recovery') === 'true';
      
      // If recovery link was clicked, set flag in sessionStorage
      if (hasRecoveryType || hasAccessToken) {
        sessionStorage.setItem('password_recovery', 'true');
        setRecoveryMode(true);
        return;
      }
      
      // Check if user is already signed in (happens after recovery redirect)
      if (isRecoverySession) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setRecoveryMode(true);
          return;
        }
      }
    };

    checkRecoveryMode();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        sessionStorage.setItem('password_recovery', 'true');
        setRecoveryMode(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signInWithEmail(email, password);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data?.user) {
        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('email')
          .eq('email', data.user.email)
          .maybeSingle();

        if (adminError || !adminData) {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "Admin privileges required",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Signed in successfully",
        });
        navigate("/admin/external-jobs");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/signin`,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description: "Password reset link has been sent",
      });
      setResetMode(false);
    }

    setLoading(false);
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (data.user) {
        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('email')
          .eq('email', data.user.email)
          .maybeSingle();

        if (adminError || !adminData) {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "Admin privileges required",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Clear recovery flag from sessionStorage
        sessionStorage.removeItem('password_recovery');
        
        toast({
          title: "Success",
          description: "Password updated successfully",
        });
        navigate("/admin/external-jobs");
      }
    } catch (error) {
      console.error("Password update error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center">Admin Access</h1>
          <p className="text-sm text-muted-foreground text-center">
            {recoveryMode 
              ? "Set your new password" 
              : resetMode 
              ? "Reset your password" 
              : "Sign in to access the admin dashboard"}
          </p>
        </div>

        {recoveryMode ? (
          <form onSubmit={handleSetNewPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Loading..." : "Set New Password"}
            </Button>
          </form>
        ) : (
          <form onSubmit={resetMode ? handleResetPassword : onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!resetMode && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Loading..." : resetMode ? "Send Reset Link" : "Sign In"}
          </Button>

          <button
            type="button"
            onClick={() => setResetMode(!resetMode)}
            className="text-sm text-muted-foreground hover:text-primary w-full text-center"
          >
            {resetMode ? "Back to sign in" : "Forgot password?"}
          </button>
        </form>
        )}
      </Card>
    </div>
  );
};

export default AdminSignIn;
