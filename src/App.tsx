import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import CandidateSearch from "./pages/CandidateSearch";
import EmployerSignUp from "./pages/EmployerSignUp";
import EmployerSignIn from "./pages/EmployerSignIn";
import CandidateSignUp from "./pages/CandidateSignUp";
import RecruiterSignUp from "./pages/RecruiterSignUp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <NavBar />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/candidates" element={<CandidateSearch />} />
              <Route path="/employer/signup" element={<EmployerSignUp />} />
              <Route path="/employer/signin" element={<EmployerSignIn />} />
              <Route path="/candidate/signup" element={<CandidateSignUp />} />
              <Route path="/recruiter/signup" element={<RecruiterSignUp />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;