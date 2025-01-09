import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import ManageJobs from "./pages/ManageJobs";
import CandidateProfile from "./pages/CandidateProfile";
import CandidateSignUp from "./pages/CandidateSignUp";
import CandidateSignIn from "./pages/CandidateSignIn";
import EmployerSignUp from "./pages/EmployerSignUp";
import EmployerSignIn from "./pages/EmployerSignIn";
import EmployerProfile from "./pages/EmployerProfile";
import EmployerDashboard from "./pages/EmployerDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import CreateVacancy from "./pages/CreateVacancy";
import VirtualRecruiterSignUp from "./pages/VirtualRecruiterSignUp";
import VirtualRecruiterSignIn from "./pages/VirtualRecruiterSignIn";
import VirtualRecruiterDashboard from "./pages/VirtualRecruiterDashboard";
import VirtualRecruiterRecommendations from "./pages/VirtualRecruiterRecommendations";
import ViewCandidateProfile from "./pages/ViewCandidateProfile";
import CandidateSearch from "./pages/CandidateSearch";
import EmployerInterviews from "./pages/EmployerInterviews";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/employer/manage-jobs" element={<ManageJobs />} />
        <Route path="/candidate/profile" element={<CandidateProfile />} />
        <Route path="/candidate/signup" element={<CandidateSignUp />} />
        <Route path="/candidate/signin" element={<CandidateSignIn />} />
        <Route path="/employer/signup" element={<EmployerSignUp />} />
        <Route path="/employer/signin" element={<EmployerSignIn />} />
        <Route path="/employer/profile" element={<EmployerProfile />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/employer/create-vacancy" element={<CreateVacancy />} />
        <Route path="/vr/signup" element={<VirtualRecruiterSignUp />} />
        <Route path="/vr/signin" element={<VirtualRecruiterSignIn />} />
        <Route path="/vr/dashboard" element={<VirtualRecruiterDashboard />} />
        <Route path="/vr/recommendations" element={<VirtualRecruiterRecommendations />} />
        <Route path="/candidate/:id" element={<ViewCandidateProfile />} />
        <Route path="/employer/candidates" element={<CandidateSearch />} />
        <Route path="/employer/interviews" element={<EmployerInterviews />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;