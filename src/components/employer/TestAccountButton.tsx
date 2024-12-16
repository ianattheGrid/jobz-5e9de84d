import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface TestAccountButtonProps {
  onAccountCreated: (email: string, password: string) => void;
}

export const TestAccountButton = ({ onAccountCreated }: TestAccountButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createTestAccount = async () => {
    setLoading(true);
    const testEmail = "test.employer@example.com";
    const testPassword = "password123";

    try {
      // First check if the user already exists
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (existingUser?.user) {
        // If user exists, just return the credentials
        toast({
          title: "Test account exists!",
          description: `Email: ${testEmail}, Password: ${testPassword}. You can use these credentials to sign in.`,
        });
        onAccountCreated(testEmail, testPassword);
        return;
      }

      // If user doesn't exist, create new account
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            user_type: 'employer',
            company_name: 'Test Company Ltd'
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Test account created!",
        description: `Email: ${testEmail}, Password: ${testPassword}. You can now sign in with these credentials.`,
      });

      onAccountCreated(testEmail, testPassword);
    } catch (error: any) {
      console.error("Error in createTestAccount:", error);
      toast({
        variant: "destructive",
        title: "Error creating test account",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      className="w-full"
      onClick={createTestAccount}
      disabled={loading}
    >
      {loading ? "Creating..." : "Create Test Account"}
    </Button>
  );
};