import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SignInFormValues, signInFormSchema } from "./signInFormSchema";

const CandidateSignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      console.log("Sign in response:", { data, error });

      if (error) throw error;

      if (!data?.user) {
        console.error("No user data returned");
        throw new Error("No user data returned");
      }

      const userType = data.user.user_metadata.user_type;
      if (userType !== "candidate") {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "This login is only for candidates. Please use the appropriate login page.",
        });
        return;
      }

      toast({
        title: "Success",
        description: "You have successfully signed in.",
      });

      navigate("/candidate/dashboard");
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while signing in.",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Candidate Sign In</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...form.register("email")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...form.register("password")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-2 rounded"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default CandidateSignIn;
