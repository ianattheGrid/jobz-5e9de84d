import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const TestAccountsCreator = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createTestEmployer = async () => {
    setLoading(true);
    const testEmail = "test.employer@example.com";
    const testPassword = "password123";

    try {
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
        title: "Test employer account created!",
        description: `Email: ${testEmail}\nPassword: ${testPassword}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating test employer account",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestCandidate = async () => {
    setLoading(true);
    const testEmail = "test.candidate@example.com";
    const testPassword = "password123";

    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            user_type: 'candidate'
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Test candidate account created!",
        description: `Email: ${testEmail}\nPassword: ${testPassword}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating test candidate account",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Create Test Accounts</CardTitle>
        <CardDescription>
          Create test accounts to explore the application workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={createTestEmployer}
          disabled={loading}
          className="w-full"
        >
          Create Test Employer Account
        </Button>
        <Button 
          onClick={createTestCandidate}
          disabled={loading}
          className="w-full"
        >
          Create Test Candidate Account
        </Button>
      </CardContent>
    </Card>
  );
};