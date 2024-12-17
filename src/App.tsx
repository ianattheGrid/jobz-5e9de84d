import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import EmployerSignUp from "./pages/EmployerSignUp";
import EmployerSignIn from "./pages/EmployerSignIn";
import CandidateSignUp from "./pages/CandidateSignUp";
import CandidateSignIn from "./pages/CandidateSignIn";
import VirtualRecruiterSignUp from "./pages/VirtualRecruiterSignUp";
import VirtualRecruiterSignIn from "./pages/VirtualRecruiterSignIn";
import VirtualRecruiterDashboard from "./pages/VirtualRecruiterDashboard";
import VirtualRecruiterRecommendations from "./pages/VirtualRecruiterRecommendations";
import CreateVacancy from "./pages/CreateVacancy";
import EmployerInterviews from "./pages/EmployerInterviews";
import EmployerDashboard from "./pages/EmployerDashboard";
import EmployerProfile from "./pages/EmployerProfile";
import CandidateSearch from "./pages/CandidateSearch";
import ManageJobs from "./pages/ManageJobs";
import CandidateProfile from "./pages/CandidateProfile";
import CandidateDashboard from "./pages/CandidateDashboard";
import ViewCandidateProfile from "./pages/ViewCandidateProfile";
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
          <Route path="/candidate/signup" element={<CandidateSignUp />} />
          <Route path="/candidate/signin" element={<CandidateSignIn />} />
          <Route path="/vr/signup" element={<VirtualRecruiterSignUp />} />
          <Route path="/vr/signin" element={<VirtualRecruiterSignIn />} />
          <Route path="/vr/dashboard" element={<VirtualRecruiterDashboard />} />
          <Route path="/vr/recommendations" element={<VirtualRecruiterRecommendations />} />
          <Route path="/employer/create-vacancy" element={<CreateVacancy />} />
          <Route path="/employer/interviews" element={<EmployerInterviews />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employer/profile" element={<EmployerProfile />} />
          <Route path="/employer/candidate-search" element={<CandidateSearch />} />
          <Route path="/employer/manage-jobs" element={<ManageJobs />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/employer/view-candidate/:id" element={<ViewCandidateProfile />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;