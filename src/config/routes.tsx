import { Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Jobs from "@/pages/Jobs";
import CandidateSignUp from "@/pages/CandidateSignUp";
import CandidateSignIn from "@/pages/CandidateSignIn";
import CandidateProfile from "@/pages/CandidateProfile";
import CandidateDashboard from "@/pages/CandidateDashboard";
import DummyCandidateProfile from "@/pages/DummyCandidateProfile";
import EmployerSignUp from "@/pages/EmployerSignUp";
import EmployerSignIn from "@/pages/EmployerSignIn";
import EmployerProfile from "@/pages/EmployerProfile";
import EmployerDashboard from "@/pages/EmployerDashboard";
import EmployerInterviews from "@/pages/EmployerInterviews";
import CreateVacancy from "@/pages/CreateVacancy";
import ManageJobs from "@/pages/ManageJobs";
import VirtualRecruiterSignUp from "@/pages/VirtualRecruiterSignUp";
import VirtualRecruiterSignIn from "@/pages/VirtualRecruiterSignIn";
import VirtualRecruiterDashboard from "@/pages/VirtualRecruiterDashboard";
import VirtualRecruiterRecommendations from "@/pages/VirtualRecruiterRecommendations";
import CandidateSearch from "@/pages/CandidateSearch";
import ViewCandidateProfile from "@/pages/ViewCandidateProfile";

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
    path: "/candidate/dashboard",
    element: <CandidateDashboard />
  },
  {
    path: "/candidate/dummy-profile",
    element: <DummyCandidateProfile />
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
    path: "/candidate/search",
    element: <CandidateSearch />
  },
  {
    path: "/candidate/:id",
    element: <ViewCandidateProfile />
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
];