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
      // Try to sign in first to check if the account exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          // Account doesn't exist, create it
          const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
              data: {
                user_type: 'employer',
                company_name: 'Test Company Ltd'
              },
              emailRedirectTo: window.location.origin + '/employer/signin'
            }
          });

          if (error) {
            throw error;
          }

          toast({
            title: "Test account created!",
            description: `Email: ${testEmail}, Password: ${testPassword}. You can now sign in with these credentials.`,
          });
          onAccountCreated(testEmail, testPassword);
        } else {
          throw signInError;
        }
      } else {
        // Account exists and sign in successful
        await supabase.auth.signOut(); // Sign out immediately since we just want to check existence
        toast({
          title: "Test account exists!",
          description: `Email: ${testEmail}, Password: ${testPassword}. You can use these credentials to sign in.`,
        });
        onAccountCreated(testEmail, testPassword);
      }
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