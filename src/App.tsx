import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import { AppLayout } from './components/layout/AppLayout';
import { Toaster } from './components/ui/toaster';
import Index from './pages/Index';

// Candidate routes
import CandidateSignIn from './pages/CandidateSignIn';
import CandidateSignUp from './pages/CandidateSignUp';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateProfile from './pages/CandidateProfile';
import PreviewCandidateProfile from './pages/PreviewCandidateProfile';
import CandidateApplications from './pages/CandidateApplications';
import CandidateInterviews from './pages/CandidateInterviews';
import CandidateAccountSettings from './pages/CandidateAccountSettings';

// Employer routes
import EmployerSignIn from './pages/EmployerSignIn';
import EmployerSignUp from './pages/EmployerSignUp';
import EmployerDashboard from './pages/EmployerDashboard';
import CreateVacancy from './pages/CreateVacancy';
import ManageJobs from './pages/ManageJobs';
import EmployerProfile from './pages/EmployerProfile';
import PreviewEmployerProfile from './pages/PreviewEmployerProfile';
import EmployerInterviews from './pages/EmployerInterviews';

// Virtual Recruiter routes
import VirtualRecruiterSignIn from './pages/VirtualRecruiterSignIn';
import VirtualRecruiterSignUp from './pages/VirtualRecruiterSignUp';
import VirtualRecruiterDashboard from './pages/VirtualRecruiterDashboard';
import VirtualRecruiterRecommendations from './pages/VirtualRecruiterRecommendations';

// Common routes
import Jobs from './pages/Jobs';
import ViewCandidateProfile from './pages/ViewCandidateProfile';
import ViewEmployerProfile from './pages/ViewEmployerProfile';
import CandidateSearch from './pages/CandidateSearch';

// Protected route wrapper
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Test only
import DummyCandidateProfile from './pages/DummyCandidateProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout><Outlet /></AppLayout>}>
          <Route index element={<Index />} />
          
          {/* Candidate routes */}
          <Route path="candidate/signin" element={<CandidateSignIn />} />
          <Route path="candidate/signup" element={<CandidateSignUp />} />
          <Route path="candidate/dashboard" element={<ProtectedRoute userType="candidate"><CandidateDashboard /></ProtectedRoute>} />
          <Route path="candidate/profile" element={<ProtectedRoute userType="candidate"><CandidateProfile /></ProtectedRoute>} />
          <Route path="candidate/profile/preview" element={<ProtectedRoute userType="candidate"><PreviewCandidateProfile /></ProtectedRoute>} />
          <Route path="candidate/applications" element={<ProtectedRoute userType="candidate"><CandidateApplications /></ProtectedRoute>} />
          <Route path="candidate/interviews" element={<ProtectedRoute userType="candidate"><CandidateInterviews /></ProtectedRoute>} />
          <Route path="candidate/account" element={<ProtectedRoute userType="candidate"><CandidateAccountSettings /></ProtectedRoute>} />
          <Route path="candidate/settings" element={<ProtectedRoute userType="candidate"><CandidateAccountSettings /></ProtectedRoute>} />
          
          {/* Employer routes */}
          <Route path="employer/signin" element={<EmployerSignIn />} />
          <Route path="employer/signup" element={<EmployerSignUp />} />
          <Route path="employer/dashboard" element={<ProtectedRoute userType="employer"><EmployerDashboard /></ProtectedRoute>} />
          <Route path="employer/create-vacancy" element={<ProtectedRoute userType="employer"><CreateVacancy /></ProtectedRoute>} />
          <Route path="employer/manage-jobs" element={<ProtectedRoute userType="employer"><ManageJobs /></ProtectedRoute>} />
          <Route path="employer/profile" element={<ProtectedRoute userType="employer"><EmployerProfile /></ProtectedRoute>} />
          <Route path="employer/profile/preview" element={<ProtectedRoute userType="employer"><PreviewEmployerProfile /></ProtectedRoute>} />
          <Route path="employer/interviews" element={<ProtectedRoute userType="employer"><EmployerInterviews /></ProtectedRoute>} />
          <Route path="employer/candidate/:id" element={<ProtectedRoute userType="employer"><ViewCandidateProfile /></ProtectedRoute>} />
          <Route path="employer/candidates" element={<ProtectedRoute userType="employer"><CandidateSearch /></ProtectedRoute>} />
          <Route path="employer/candidate-search" element={<ProtectedRoute userType="employer"><CandidateSearch /></ProtectedRoute>} />
          
          {/* Virtual Recruiter routes */}
          <Route path="vr/signin" element={<VirtualRecruiterSignIn />} />
          <Route path="vr/signup" element={<VirtualRecruiterSignUp />} />
          <Route path="vr/dashboard" element={<ProtectedRoute userType="vr"><VirtualRecruiterDashboard /></ProtectedRoute>} />
          <Route path="vr/recommendations" element={<ProtectedRoute userType="vr"><VirtualRecruiterRecommendations /></ProtectedRoute>} />
          
          {/* Common routes */}
          <Route path="jobs" element={<Jobs />} />
          <Route path="employer/:id" element={<ViewEmployerProfile />} />
          
          {/* Test Routes */}
          <Route path="dummy-profile" element={<DummyCandidateProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
