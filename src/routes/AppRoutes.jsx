import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import AdminLayout from "../layouts/AdminLayout";
import CounselorLayout from "../layouts/CounselorLayout";

import OrientLandingPage from "../components/landing/OrientLandingPage";
import LoginPage from "../components/auth/Login";
import RegisterPage from "../components/auth/RegisterPage";

import StudentDashboard from "../components/pages/StudentDashboard";
import CompleteAssessmentChatbot from "../chat/RiasecAiChatbot";
import RecommendationsPage from "../components/pages/RecommendationsPage";
import MentorshipManagement from "../components/mentor/MentorshipManagement";
import StudentRecommendedSchools from "../components/School/StudentRecommendedSchools";
import Board from "../components/board/Board";

import CounselorDashboard from "../components/counselor/CounselorDashboard";
import CounselorSessions from "../components/counselor/CounselorSessions";
import CounselorStudents from "../components/counselor/CounselorStudents";
import CounselorReviews from "../components/counselor/CounselorReviews";
import CounselorResources from "../components/counselor/CounselorResources";
import CounselorAvailability from "../components/counselor/CounselorAvailability";

import AdminOverview from "../components/admin/AdminOverview";
import AdminUsers from "../components/admin/AdminUsers";
import AdminFields from "../components/admin/AdminFields";
import AdminSchools from "../components/admin/AdminSchools";
import AdminAssessments from "../components/admin/AdminAssessments";
import AdminMentorship from "../components/admin/AdminMentorship";
import AdminSettings from "../components/admin/AdminSettings";

import ProtectedRoute from "./ProtectedRoute";

import UnauthorizedPage from "../components/pages/UnauthorizedPage";
import NotFoundPage from "../components/pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<OrientLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/assessment" element={<CompleteAssessmentChatbot />} />
          <Route path="/mentorship" element={<MentorshipManagement />} />
          <Route path="/StudentRecommendedSchools" element={<StudentRecommendedSchools />} />
          <Route path="/board" element={<Board />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["COUNSELOR", "ADMIN"]} />}>
        <Route element={<CounselorLayout />}>
          <Route path="/counselor" element={<Navigate to="/counselor/dashboard" replace />} />
          <Route path="/counselor/dashboard" element={<CounselorDashboard />} />
          <Route path="/counselor/sessions" element={<CounselorSessions />} />
          <Route path="/counselor/students" element={<CounselorStudents />} />
          <Route path="/counselor/reviews" element={<CounselorReviews />} />
          <Route path="/counselor/resources" element={<CounselorResources />} />
          <Route path="/counselor/availability" element={<CounselorAvailability />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/fields" element={<AdminFields />} />
          <Route path="/admin/schools" element={<AdminSchools />} />
          <Route path="/admin/assessments" element={<AdminAssessments />} />
          <Route path="/admin/mentorship" element={<AdminMentorship />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
