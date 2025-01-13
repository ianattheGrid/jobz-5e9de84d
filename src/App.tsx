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
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route 
            path="/employer/manage-jobs" 
            element={
              <ProtectedRoute allowedUserTypes={['employer']}>
                <ManageJobs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/candidate/profile" 
            element={
              <ProtectedRoute allowedUserTypes={['candidate']}>
                <CandidateProfile />
              </ProtectedRoute>
            } 
          />
          <Route path="/candidate/signup" element={<CandidateSignUp />} />
          <Route path="/candidate/signin" element={<CandidateSignIn />} />
          <Route path="/employer/signup" element={<EmployerSignUp />} />
          <Route path="/employer/signin" element={<EmployerSignIn />} />
          <Route 
            path="/employer/profile" 
            element={
              <ProtectedRoute allowedUserTypes={['employer']}>
                <EmployerProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer/dashboard" 
            element={
              <ProtectedRoute allowedUserTypes={['employer']}>
                <EmployerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/candidate/dashboard" 
            element={
              <ProtectedRoute allowedUserTypes={['candidate']}>
                <CandidateDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer/create-vacancy" 
            element={
              <ProtectedRoute allowedUserTypes={['employer']}>
                <CreateVacancy />
              </ProtectedRoute>
            } 
          />
          <Route path="/vr/signup" element={<VirtualRecruiterSignUp />} />
          <Route path="/vr/signin" element={<VirtualRecruiterSignIn />} />
          <Route 
            path="/vr/dashboard" 
            element={
              <ProtectedRoute allowedUserTypes={['vr']}>
                <VirtualRecruiterDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vr/recommendations" 
            element={
              <ProtectedRoute allowedUserTypes={['vr']}>
                <VirtualRecruiterRecommendations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/candidate/:id" 
            element={
              <ProtectedRoute allowedUserTypes={['employer', 'vr']}>
                <ViewCandidateProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer/candidates" 
            element={
              <ProtectedRoute allowedUserTypes={['employer']}>
                <CandidateSearch />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer/interviews" 
            element={
              <ProtectedRoute allowedUserTypes={['employer']}>
                <EmployerInterviews />
              </ProtectedRoute>
            } 
          />
          {/* Catch all route - must be last */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;