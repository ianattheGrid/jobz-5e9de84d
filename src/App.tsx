import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import EmployerSignUp from "./pages/EmployerSignUp";
import EmployerSignIn from "./pages/EmployerSignIn";
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
          <Route path="/employer/signup" element={<EmployerSignUp />} />
          <Route path="/employer/signin" element={<EmployerSignIn />} />
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