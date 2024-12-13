import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import CandidateSignUp from "./pages/CandidateSignUp";
import CandidateSignIn from "./pages/CandidateSignIn";
import EmployerSignUp from "./pages/EmployerSignUp";
import EmployerSignIn from "./pages/EmployerSignIn";
import RecruiterSignUp from "./pages/RecruiterSignUp";
import RecruiterSignIn from "./pages/RecruiterSignIn";
import CreateVacancy from "./pages/CreateVacancy";
import EmployerInterviews from "./pages/EmployerInterviews";
import EmployerDashboard from "./pages/EmployerDashboard";
import CandidateSearch from "./pages/CandidateSearch";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <NavBar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/candidate/signup" element={<CandidateSignUp />} />
          <Route path="/candidate/signin" element={<CandidateSignIn />} />
          <Route path="/employer/signup" element={<EmployerSignUp />} />
          <Route path="/employer/signin" element={<EmployerSignIn />} />
          <Route path="/recruiter/signup" element={<RecruiterSignUp />} />
          <Route path="/recruiter/signin" element={<RecruiterSignIn />} />
          <Route path="/employer/create-vacancy" element={<CreateVacancy />} />
          <Route path="/employer/interviews" element={<EmployerInterviews />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employer/candidate-search" element={<CandidateSearch />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;