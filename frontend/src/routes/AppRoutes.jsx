import { Routes, Route, Navigate } from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';
import CandidateLayout from '../layouts/CandidateLayout';
import RecruiterLayout from '../layouts/RecruiterLayout';
import ProtectedRoute from './ProtectedRoute';

// Guest Pages
import HomePage from '../pages/guest/HomePage';
import BrowseJobsPage from '../pages/guest/BrowseJobsPage';
import JobDetailsPage from '../pages/guest/JobDetailsPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Candidate Pages
import CandidateDashboard from '../pages/candidate/CandidateDashboard';
import MyApplicationsPage from '../pages/candidate/MyApplicationsPage';
import CandidateProfilePage from '../pages/candidate/CandidateProfilePage';
import ResumePage from '../pages/candidate/ResumePage';
import AIToolsPage from '../pages/candidate/AIToolsPage';
import SettingsPage from '../pages/candidate/SettingsPage';

// Recruiter Pages
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';
import CompaniesPage from '../pages/recruiter/CompaniesPage';
import CreateCompanyPage from '../pages/recruiter/CreateCompanyPage';
import RecruiterJobsPage from '../pages/recruiter/RecruiterJobsPage';
import CreateJobPage from '../pages/recruiter/CreateJobPage';
import EditJobPage from '../pages/recruiter/EditJobPage';
import ApplicationsPage from '../pages/recruiter/ApplicationsPage';
import JobApplicantsPage from '../pages/recruiter/JobApplicantsPage';
import RecruiterProfilePage from '../pages/recruiter/RecruiterProfilePage';
import RecruiterSettingsPage from '../pages/recruiter/RecruiterSettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Guest Routes */}
      <Route element={<GuestLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<BrowseJobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/companies" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Candidate Routes */}
      <Route
        element={
          <ProtectedRoute role="CANDIDATE">
            <CandidateLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/jobs" element={<BrowseJobsPage />} />
        <Route path="/candidate/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/candidate/applications" element={<MyApplicationsPage />} />
        <Route path="/candidate/profile" element={<CandidateProfilePage />} />
        <Route path="/candidate/resume" element={<ResumePage />} />
        <Route path="/candidate/ai-tools" element={<AIToolsPage />} />
        <Route path="/candidate/settings" element={<SettingsPage />} />
      </Route>

      {/* Recruiter Routes */}
      <Route
        element={
          <ProtectedRoute role="RECRUITER">
            <RecruiterLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/companies" element={<CompaniesPage />} />
        <Route path="/recruiter/companies/new" element={<CreateCompanyPage />} />
        <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
        <Route path="/recruiter/jobs/new" element={<CreateJobPage />} />
        <Route path="/recruiter/jobs/:id/edit" element={<EditJobPage />} />
        <Route path="/recruiter/applications" element={<ApplicationsPage />} />
        <Route path="/recruiter/applications/:jobId" element={<JobApplicantsPage />} />
        <Route path="/recruiter/profile" element={<RecruiterProfilePage />} />
        <Route path="/recruiter/settings" element={<RecruiterSettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
