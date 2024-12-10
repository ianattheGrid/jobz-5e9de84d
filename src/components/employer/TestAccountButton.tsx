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
      console.log("Creating test account with:", { testEmail, testPassword });
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            user_type: 'employer',
            company_name: 'Test Company'
          }
        }
      });

      console.log("Test account creation response:", { data, error });

      if (error) {
        console.error("Test account creation error:", error);
        throw error;
      }

      // Send welcome email
      const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          to: [testEmail],
          userType: 'employer'
        }
      });

      if (emailError) {
        console.error("Error sending welcome email:", emailError);
      }

      toast({
        title: "Test account created!",
        description: `Email: ${testEmail}, Password: ${testPassword}. Please check your inbox for the welcome email.`,
      });

      onAccountCreated(testEmail, testPassword);
    } catch (error: any) {
      console.error("Error in createTestAccount:", error);
      toast({
        variant: "destructive",
        title: "Error creating test account",
        description: error.message,
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
      Create Test Account
    </Button>
  );
};