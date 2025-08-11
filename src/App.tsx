
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import './styles/tabs.css'; // Directly import the CSS
import { AppLayout } from './components/layout/AppLayout';
import { Toaster } from './components/ui/toaster';
import Index from './pages/Index';

// Candidate routes
import CandidateSignIn from './pages/CandidateSignIn';
import CandidateSignUp from './pages/CandidateSignUp';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateProfile from './pages/CandidateProfile';
import PreviewCandidateProfile from './pages/PreviewCandidateProfile';
import CandidateApplications from './pages/candidate/Applications';
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
import VirtualRecruiterProfile from './pages/VirtualRecruiterProfile';
import PreviewVRProfile from './pages/PreviewVRProfile';

// Common routes
import Jobs from './pages/Jobs';
import FAQ from './pages/FAQ';
import QRCodePage from './pages/QRCodePage';
import PricingPage from './pages/PricingPage';
import PushSetup from './pages/PushSetup';

import ViewCandidateProfile from './pages/ViewCandidateProfile';
import ViewEmployerProfile from './pages/ViewEmployerProfile';
import CandidateSearch from './pages/CandidateSearch';

// Protected route wrapper
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProtectedRouteWithTimeout } from './components/auth/ProtectedRouteWithTimeout';

// Test only
import DummyCandidateProfile from './pages/DummyCandidateProfile';

// Demo profiles
import DemoCandidateProfile from './pages/DemoCandidateProfile';
import DemoEmployerProfile from './pages/DemoEmployerProfile';
import DemoVirtualRecruiterProfile from './pages/DemoVirtualRecruiterProfile';
import PreviewEmployerRealDemo from './pages/PreviewEmployerRealDemo';
import PreviewCandidateRealDemo from './pages/PreviewCandidateRealDemo';

// Swipe interfaces
import SwipeCandidates from './pages/SwipeCandidates';
import SwipeEmployers from './pages/SwipeEmployers';
import CVRedirect from './pages/CVRedirect';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout><Outlet /></AppLayout>}>
          <Route index element={<Index />} />
          
          {/* Candidate routes */}
          <Route path="candidate/signin" element={<CandidateSignIn />} />
          <Route path="candidate/signup" element={<CandidateSignUp />} />
          <Route path="candidate/dashboard" element={<ProtectedRouteWithTimeout userType="candidate"><CandidateDashboard /></ProtectedRouteWithTimeout>} />
          <Route path="candidate/profile" element={<CandidateProfile />} />
          
          {/* Make the preview route completely public and accessible to everyone */}
          <Route path="candidate/profile/preview" element={<PreviewCandidateProfile />} />
          
          <Route path="candidate/applications" element={<ProtectedRouteWithTimeout userType="candidate"><CandidateApplications /></ProtectedRouteWithTimeout>} />
          <Route path="candidate/interviews" element={<ProtectedRouteWithTimeout userType="candidate"><CandidateInterviews /></ProtectedRouteWithTimeout>} />
          <Route path="candidate/account" element={<ProtectedRouteWithTimeout userType="candidate"><CandidateAccountSettings /></ProtectedRouteWithTimeout>} />
          <Route path="candidate/settings" element={<ProtectedRouteWithTimeout userType="candidate"><CandidateAccountSettings /></ProtectedRouteWithTimeout>} />
          
          {/* Employer routes */}
          <Route path="employer/signin" element={<EmployerSignIn />} />
          <Route path="employer/signup" element={<EmployerSignUp />} />
          <Route path="employer/dashboard" element={<ProtectedRouteWithTimeout userType="employer"><EmployerDashboard /></ProtectedRouteWithTimeout>} />
          <Route path="employer/create-vacancy" element={<ProtectedRouteWithTimeout userType="employer"><CreateVacancy /></ProtectedRouteWithTimeout>} />
          <Route path="employer/manage-jobs" element={<ProtectedRouteWithTimeout userType="employer"><ManageJobs /></ProtectedRouteWithTimeout>} />
          <Route path="employer/profile" element={<ProtectedRouteWithTimeout userType="employer"><EmployerProfile /></ProtectedRouteWithTimeout>} />
          <Route path="employer/profile/preview" element={<PreviewEmployerProfile />} />
          <Route path="employer/interviews" element={<ProtectedRouteWithTimeout userType="employer"><EmployerInterviews /></ProtectedRouteWithTimeout>} />
          <Route path="employer/candidate/:id" element={<ProtectedRouteWithTimeout userType="employer"><ViewCandidateProfile /></ProtectedRouteWithTimeout>} />
          <Route path="employer/candidates" element={<ProtectedRouteWithTimeout userType="employer"><CandidateSearch /></ProtectedRouteWithTimeout>} />
          <Route path="employer/candidate-search" element={<ProtectedRouteWithTimeout userType="employer"><CandidateSearch /></ProtectedRouteWithTimeout>} />
          
          {/* Virtual Recruiter routes */}
          <Route path="vr/signin" element={<VirtualRecruiterSignIn />} />
          <Route path="vr/signup" element={<VirtualRecruiterSignUp />} />
          <Route path="vr/dashboard" element={<ProtectedRouteWithTimeout userType="vr"><VirtualRecruiterDashboard /></ProtectedRouteWithTimeout>} />
          <Route path="vr/recommendations" element={<ProtectedRouteWithTimeout userType="vr"><VirtualRecruiterRecommendations /></ProtectedRouteWithTimeout>} />
          <Route path="vr/profile" element={<ProtectedRouteWithTimeout userType="vr"><VirtualRecruiterProfile /></ProtectedRouteWithTimeout>} />
          <Route path="vr/profile/preview" element={<PreviewVRProfile />} />
          
          {/* Common routes */}
          <Route path="jobs" element={<Jobs />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="push-setup" element={<PushSetup />} />
          <Route path="cv-view" element={<CVRedirect />} />
          
          <Route path="qr-code" element={<QRCodePage />} />
          <Route path="employer/:id" element={<ViewEmployerProfile />} />
          
          {/* Test Routes */}
          <Route path="dummy-profile" element={<DummyCandidateProfile />} />
          
          {/* Demo Profile Routes */}
          <Route path="demo/candidate" element={<DemoCandidateProfile />} />
          <Route path="demo/employer" element={<DemoEmployerProfile />} />
          <Route path="demo/virtual-recruiter" element={<DemoVirtualRecruiterProfile />} />

          {/* Preview with real components using demo data */}
          <Route path="preview/employer-demo" element={<PreviewEmployerRealDemo />} />
          <Route path="preview/candidate-demo" element={<PreviewCandidateRealDemo />} />
          
          {/* Swipe Interface Routes */}
          <Route path="swipe/candidates" element={<ProtectedRouteWithTimeout userType="employer"><SwipeCandidates /></ProtectedRouteWithTimeout>} />
          <Route path="swipe/employers" element={<ProtectedRouteWithTimeout userType="candidate"><SwipeEmployers /></ProtectedRouteWithTimeout>} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
