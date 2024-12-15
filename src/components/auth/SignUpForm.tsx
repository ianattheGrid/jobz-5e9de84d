import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

interface SignUpFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

export const SignUpForm = ({ onSubmit, loading }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email" 
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password" 
          required
        />
      </div>
      <Button className="w-full bg-red-800 hover:bg-red-900 text-white" type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/candidate/signin" className="text-red-800 hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
};