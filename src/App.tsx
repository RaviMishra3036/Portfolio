import { Routes, Route } from 'react-router-dom';
import Portfolio from '@/pages/Portfolio';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/pages/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import AdminProfile from '@/pages/admin/AdminProfile';
import AdminAbout from '@/pages/admin/AdminAbout';
import AdminProjects from '@/pages/admin/AdminProjects';
import AdminSkills from '@/pages/admin/AdminSkills';
import AdminEducation from '@/pages/admin/AdminEducation';
import AdminCertifications from '@/pages/admin/AdminCertifications';
import AdminAchievements from '@/pages/admin/AdminAchievements';
import AdminServices from '@/pages/admin/AdminServices';
import AdminMessages from '@/pages/admin/AdminMessages';
import AdminResume from '@/pages/admin/AdminResume';
import AdminSocialLinks from '@/pages/admin/AdminSocialLinks';
import AdminSettings from '@/pages/admin/AdminSettings';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="about" element={<AdminAbout />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="education" element={<AdminEducation />} />
        <Route path="certifications" element={<AdminCertifications />} />
        <Route path="achievements" element={<AdminAchievements />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="resume" element={<AdminResume />} />
        <Route path="social-links" element={<AdminSocialLinks />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
