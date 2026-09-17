import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/authStore.js';
import { homeFor } from './components/common/ProtectedRoute.jsx';
import LandingPage from './pages/public/LandingPage.jsx';
import Login from './pages/auth/Login.jsx';
import StaffLogin from './pages/auth/StaffLogin.jsx';
import OrganisationAuth from './pages/auth/OrganisationAuth.jsx';
import OrganisationLogin from './pages/auth/OrganisationLogin.jsx';
import SoloLogin from './pages/auth/SoloLogin.jsx';
import SuperAdminLogin from './pages/auth/SuperAdminLogin.jsx';
import ActivateAccount from './pages/auth/ActivateAccount.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import SignupChoice from './pages/auth/SignupChoice.jsx';
import SoloSignup from './pages/auth/SoloSignup.jsx';
import CompanySignup from './pages/auth/CompanySignup.jsx';
import WorkspaceLayout from './layouts/WorkspaceLayout.jsx';
import PlatformAdminLayout from './layouts/PlatformAdminLayout.jsx';
import WorkspaceDashboard from './pages/shared/WorkspaceDashboard.jsx';
import CompanyDashboard from './pages/company/CompanyDashboard.jsx';
import TLDashboard from './pages/company/TLDashboard.jsx';
import TeamMembersPage from './pages/company/TeamMembersPage.jsx';
import PlatformOverview from './pages/platform-admin/PlatformOverview.jsx';
import PlatformCompanies from './pages/platform-admin/PlatformCompanies.jsx';
import PlatformPlans from './pages/platform-admin/PlatformPlans.jsx';
import PlatformFreelancers from './pages/platform-admin/PlatformFreelancers.jsx';
import PlatformPaymentDetails from './pages/platform-admin/PlatformPaymentDetails.jsx';
import AdminReports from './pages/admin/Reports.jsx';
import LeadFormPage from './pages/shared/LeadFormPage.jsx';
import PipelinePage from './pages/shared/PipelinePage.jsx';
import ClientsPage from './pages/shared/ClientsPage.jsx';
import ProjectsPage from './pages/shared/ProjectsPage.jsx';
import RetainersPage from './pages/shared/RetainersPage.jsx';
import PaymentsPage from './pages/shared/PaymentsPage.jsx';
import MessagesPage from './pages/shared/MessagesPage.jsx';
import MeetingsPage from './pages/shared/MeetingsPage.jsx';
import TasksPage from './pages/shared/TasksPage.jsx';
import SettingsPage from './pages/shared/SettingsPage.jsx';
import LeadsListPage from './pages/shared/LeadsListPage.jsx';
import CallsPage from './pages/shared/CallsPage.jsx';
import PublicLeadPage from './pages/public/PublicLeadPage.jsx';
import PublicReviewsPage from './pages/public/PublicReviewsPage.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

export default function App() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const home = homeFor(user?.role);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/apply" element={<PublicLeadPage />} />
      <Route path="/reviews/:slug" element={<PublicReviewsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/organisation" element={<OrganisationAuth />} />
      <Route path="/organisation/signin" element={<OrganisationLogin />} />
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/solo/login" element={<SoloLogin />} />
      <Route path="/super-admin/login" element={<SuperAdminLogin />} />
      <Route path="/login/staff" element={<Navigate to="/staff/login" replace />} />
      <Route path="/login/company" element={<Navigate to="/organisation/signin" replace />} />
      <Route path="/login/solo" element={<Navigate to="/solo/login" replace />} />
      <Route path="/activate" element={<ActivateAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signup" element={<SignupChoice />} />
      <Route path="/signup/solo" element={<SoloSignup />} />
      <Route path="/signup/company" element={<CompanySignup />} />

      {/* Shared workspace: COMPANY_ADMIN, TL, SALES, SOLO. Backend scopes data per role. */}
      <Route element={<ProtectedRoute roles={['COMPANY_ADMIN', 'TL', 'SALES', 'SOLO']} />}>
        <Route path="/app" element={<WorkspaceLayout />}>
          <Route index element={<WorkspaceDashboard />} />
          <Route path="company" element={<ProtectedRoute roles={['COMPANY_ADMIN']} />}>
            <Route index element={<CompanyDashboard />} />
          </Route>
          <Route path="team" element={<ProtectedRoute roles={['TL']} />}>
            <Route index element={<TLDashboard />} />
          </Route>
          <Route path="members" element={<ProtectedRoute roles={['COMPANY_ADMIN', 'TL']} />}>
            <Route index element={<TeamMembersPage />} />
          </Route>
          <Route path="leads" element={<LeadsListPage />} />
          <Route path="leads/new" element={<LeadFormPage />} />
          <Route path="leads/:id" element={<LeadFormPage />} />
          <Route path="calls" element={<CallsPage />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="retainers" element={<RetainersPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="meetings" element={<MeetingsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="reports" element={<ProtectedRoute roles={['COMPANY_ADMIN', 'TL']} />}>
            <Route index element={<AdminReports />} />
          </Route>
          <Route path="settings" element={<SettingsPage canEditOrg />} />
        </Route>
      </Route>

      {/* Platform Admin: entirely separate tree, metadata-only pages. */}
      <Route element={<ProtectedRoute roles={['PLATFORM_ADMIN']} />}>
        <Route path="/platform-admin" element={<PlatformAdminLayout />}>
          <Route index element={<PlatformOverview />} />
          <Route path="companies" element={<PlatformCompanies />} />
          <Route path="plans" element={<PlatformPlans />} />
          <Route path="freelancers" element={<PlatformFreelancers />} />
          <Route path="payment-details" element={<PlatformPaymentDetails />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={token ? home : '/'} replace />} />
    </Routes>
  );
}
