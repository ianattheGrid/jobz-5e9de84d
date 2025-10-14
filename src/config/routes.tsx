import { Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "@/pages/Index";
import Jobs from "@/pages/Jobs";
import DummyCandidateProfile from "@/pages/DummyCandidateProfile";
import CandidateSignUp from "@/pages/CandidateSignUp";
import CandidateSignIn from "@/pages/CandidateSignIn";
import CandidateProfile from "@/pages/CandidateProfile";
import CandidateDashboard from "@/pages/CandidateDashboard";
import EmployerSignUp from "@/pages/EmployerSignUp";
import EmployerSignIn from "@/pages/EmployerSignIn";
import EmployerProfile from "@/pages/EmployerProfile";
import PreviewEmployerProfile from "@/pages/PreviewEmployerProfile";
import EmployerDashboard from "@/pages/EmployerDashboard";
import EmployerInterviews from "@/pages/EmployerInterviews";
import CreateVacancy from "@/pages/CreateVacancy";
import ManageJobs from "@/pages/ManageJobs";
import VirtualRecruiterSignUp from "@/pages/VirtualRecruiterSignUp";
import VirtualRecruiterSignIn from "@/pages/VirtualRecruiterSignIn";
import VirtualRecruiterDashboard from "@/pages/VirtualRecruiterDashboard";
import VirtualRecruiterRecommendations from "@/pages/VirtualRecruiterRecommendations";
import VirtualRecruiterProfile from "@/pages/VirtualRecruiterProfile";
import CandidateSearch from "@/pages/CandidateSearch";
import ViewCandidateProfile from "@/pages/ViewCandidateProfile";
import ViewEmployerProfile from "@/pages/ViewEmployerProfile";
import CandidateApplications from "@/pages/CandidateApplications";
import CandidateAccountSettings from "@/pages/CandidateAccountSettings";
import CandidateInterviews from "@/pages/CandidateInterviews";
import PreviewCandidateProfile from "@/pages/PreviewCandidateProfile";
import FAQ from "@/pages/FAQ";
import AdminSignIn from "@/pages/AdminSignIn";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminExternalJobs from "@/pages/AdminExternalJobs";
import AdminUserManagement from "@/pages/AdminUserManagement";
import AdminCandidates from "@/pages/AdminCandidates";
import AdminVirtualRecruiters from "@/pages/AdminVirtualRecruiters";

import CandidateChat from "@/pages/CandidateChat";

export const routes = [
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/faq",
    element: <FAQ />
  },
  {
    path: "/candidate/dummy-profile",
    element: <DummyCandidateProfile />
  },
  {
    path: "/candidate/signup",
    element: <CandidateSignUp />
  },
  {
    path: "/candidate/signin",
    element: <CandidateSignIn />
  },
  {
    path: "/candidate/profile",
    element: <CandidateProfile />
  },
  {
    path: "/candidate/profile/preview",
    element: <PreviewCandidateProfile />
  },
  {
    path: "/candidate/dashboard",
    element: <CandidateDashboard />
  },
  {
    path: "/candidate/search",
    element: <CandidateSearch />
  },
  {
    path: "/candidate/:id",
    element: <ViewCandidateProfile />
  },
  {
    path: "/candidate/applications",
    element: <CandidateApplications />
  },
  {
    path: "/candidate/account",
    element: <CandidateAccountSettings />
  },
  {
    path: "/candidate/settings",
    element: <CandidateAccountSettings />
  },
  {
    path: "/candidate/interviews",
    element: <CandidateInterviews />
  },
  {
    path: "/candidate/chat",
    element: <CandidateChat />
  },
  {
    path: "/employer/signup",
    element: <EmployerSignUp />
  },
  {
    path: "/employer/signin",
    element: <EmployerSignIn />
  },
  {
    path: "/employer/profile",
    element: <EmployerProfile />
  },
  {
    path: "/employer/profile/preview",
    element: <PreviewEmployerProfile />
  },
  {
    path: "/employer/dashboard",
    element: <EmployerDashboard />
  },
  {
    path: "/employer/interviews",
    element: <EmployerInterviews />
  },
  {
    path: "/employer/create-vacancy",
    element: <CreateVacancy />
  },
  {
    path: "/employer/manage-jobs",
    element: <ManageJobs />
  },
  {
    path: "/employer/candidate-search",
    element: <CandidateSearch />,
  },
  {
    path: "/employer/:id",
    element: <ViewEmployerProfile />
  },
  {
    path: "/vr/signup",
    element: <VirtualRecruiterSignUp />
  },
  {
    path: "/vr/signin",
    element: <VirtualRecruiterSignIn />
  },
  {
    path: "/vr/dashboard",
    element: <VirtualRecruiterDashboard />
  },
  {
    path: "/vr/recommendations",
    element: <VirtualRecruiterRecommendations />
  },
  {
    path: "/vr/profile",
    element: <VirtualRecruiterProfile />
  },
  {
    path: "/admin/signin",
    element: <AdminSignIn />
  },
  {
    path: "/admin/dashboard",
    element: <ErrorBoundary><AdminDashboard /></ErrorBoundary>
  },
  {
    path: "/admin/external-jobs",
    element: <ErrorBoundary><AdminExternalJobs /></ErrorBoundary>
  },
  {
    path: "/admin/users",
    element: <ErrorBoundary><AdminUserManagement /></ErrorBoundary>
  },
  {
    path: "/admin/candidates",
    element: <ErrorBoundary><AdminCandidates /></ErrorBoundary>
  },
  {
    path: "/admin/virtual-recruiters",
    element: <ErrorBoundary><AdminVirtualRecruiters /></ErrorBoundary>
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
];
