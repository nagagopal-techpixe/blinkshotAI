import { Routes, Route } from "react-router-dom";
import AuthLayout           from "./components/AuthLayout.jsx";
import DashboardLayout      from "./components/DashboardLayout.jsx";
import Login                from "./pages/auth/Login.jsx";
import Register             from "./pages/auth/Register.jsx";
import Dashboard            from "./pages/dashboard/Dashboard.jsx";
import Projects             from "./pages/projects/Projects.jsx";
import ProjectDetail        from "./pages/projects/ProjectDetail.jsx";
import Create               from "./pages/create/Create.jsx";
import Templates            from "./pages/templates/Templates.jsx";
import PhotoEditor          from "./pages/photo-editor/PhotoEditor.jsx";
import ReelEditor           from "./pages/reel-editor/ReelEditor.jsx";
import Team                 from "./pages/team/Team.jsx";
import Notifications        from "./pages/notifications/Notifications.jsx";
import Subscription         from "./pages/subscription/Subscription.jsx";
import Settings             from "./pages/settings/Settings.jsx";
import Analytics            from "./pages/analytics/Analytics.jsx";
import Profile              from "./pages/profile/Profile.jsx";
import PersonalInfo         from "./pages/profile/PersonalInfo.jsx";
import StorageUsage         from "./pages/profile/StorageUsage.jsx";
import APIIntegrations      from "./pages/profile/APIIntegrations.jsx";
import NotificationSettings from "./pages/profile/NotificationSettings.jsx";
import Security             from "./pages/profile/Security.jsx";
import TwoFactor            from "./pages/profile/TwoFactor.jsx";
import GlowBackground from "./components/GlowBackground.jsx";

export default function App() {
  return (
    <>
      <GlowBackground />

      <Routes>
        {/* Auth */}
        <Route path="/"         element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/login"    element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/projects"  element={<DashboardLayout><Projects /></DashboardLayout>} />

        {/* Project detail + tab sub-routes */}
        <Route path="/projects/:id"           element={<DashboardLayout><ProjectDetail /></DashboardLayout>} />
        <Route path="/projects/:id/assets"    element={<DashboardLayout><ProjectDetail /></DashboardLayout>} />
        <Route path="/projects/:id/versions"  element={<DashboardLayout><ProjectDetail /></DashboardLayout>} />
        <Route path="/projects/:id/comments"  element={<DashboardLayout><ProjectDetail /></DashboardLayout>} />
        <Route path="/projects/:id/analytics" element={<DashboardLayout><ProjectDetail /></DashboardLayout>} />
        <Route path="/projects/:id/settings"  element={<DashboardLayout><ProjectDetail /></DashboardLayout>} />

        {/* Main pages */}
        <Route path="/create"        element={<DashboardLayout><Create /></DashboardLayout>} />
        <Route path="/templates"     element={<DashboardLayout><Templates /></DashboardLayout>} />
        <Route path="/photo-editor"  element={<DashboardLayout><PhotoEditor /></DashboardLayout>} />
        <Route path="/reel-editor"   element={<DashboardLayout><ReelEditor /></DashboardLayout>} />
        <Route path="/team"          element={<DashboardLayout><Team /></DashboardLayout>} />
        <Route path="/notifications" element={<DashboardLayout><Notifications /></DashboardLayout>} />
        <Route path="/subscription"  element={<DashboardLayout><Subscription /></DashboardLayout>} />
        <Route path="/settings"      element={<DashboardLayout><Settings /></DashboardLayout>} />
        <Route path="/analytics"     element={<DashboardLayout><Analytics /></DashboardLayout>} />

        {/* Profile + sub-routes */}
        <Route path="/profile"               element={<DashboardLayout><Profile /></DashboardLayout>} />
        <Route path="/profile/personal-info" element={<DashboardLayout><PersonalInfo /></DashboardLayout>} />
        <Route path="/profile/team-settings" element={<DashboardLayout><Team /></DashboardLayout>} />
        <Route path="/profile/storage"       element={<DashboardLayout><StorageUsage /></DashboardLayout>} />
        <Route path="/profile/integrations"  element={<DashboardLayout><APIIntegrations /></DashboardLayout>} />
        <Route path="/profile/notifications" element={<DashboardLayout><NotificationSettings /></DashboardLayout>} />
        <Route path="/profile/security"      element={<DashboardLayout><Security /></DashboardLayout>} />
        <Route path="/profile/twoFactor"     element={<DashboardLayout><TwoFactor /></DashboardLayout>} />
      </Routes>
    </>
  );
}