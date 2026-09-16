import { Routes, Route } from "react-router-dom";

// Layouts
import AppLayout from "../layouts/AppLayout";

// Public pages
import OrientLandingPage from "../components/landing/OrientLandingPage";
import LoginPage from "../components/auth/Login";
import RegisterPage from "../components/auth/RegisterPage";

// Student pages
import StudentDashboard from "../components/pages/StudentDashboard";
import CompleteAssessmentChatbot from "../chat/RiasecAiChatbot";
import RecommendationsPage from "../components/pages/RecommendationsPage";
import MentorshipManagement from "../components/mentor/MentorshipManagement";

// Admin / Counselor pages
import FieldsManagement from "../components/field/FieldsManagement";
import SchoolsManagement from "../components/School/SchoolsManagement";
import CounselorSessionsPage from "../components/pages/CounselorSessionsPage";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import AssessmentGuard from "./AssessmentGuard";

// Misc
import UnauthorizedPage from "../components/pages/UnauthorizedPage";
import NotFoundPage from "../components/pages/NotFoundPage";
import StudentRecommendedSchools from "../components/School/StudentRecommendedSchools";


import Board from "../components/board/Board";


/**
 * AppRoutes — Arborescence de routes OrientCompanion.
 *
 * Matrice d'accès :
 * ┌─────────────────────────┬─────────┬──────────┬───────┐
 * │ Route                   │ STUDENT │ COUNSELOR │ ADMIN │
 * ├─────────────────────────┼─────────┼──────────┼───────┤
 * │ /dashboard              │   ✅    │    ❌    │  ✅   │
 * │ /assessment             │   ✅    │    ❌    │  ✅   │
 * │ /recommendations        │   ✅    │    ❌    │  ✅   │
 * │ /mentorship             │   ✅    │    ❌    │  ✅   │
 * │ /admin/fields           │   ❌    │    ❌    │  ✅   │
 * │ /admin/schools          │   ❌    │    ❌    │  ✅   │
 * │ /counselor/sessions     │   ❌    │    ✅    │  ✅   │
 * └─────────────────────────┴─────────┴──────────┴───────┘
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* ── PUBLIQUES ──────────────────────────────────────────────── */}
      <Route path="/" element={<OrientLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── PROTÉGÉES : STUDENT + ADMIN ────────────────────────────── */}
      {/* L'ADMIN a accès à toutes les pages étudiantes pour supervision */}
      <Route element={<ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard"    element={<StudentDashboard />} />
          <Route path="/assessment"   element={<CompleteAssessmentChatbot />} />
          <Route path="/mentorship"   element={<MentorshipManagement />} />
          <Route path="/StudentRecommendedSchools" element={<StudentRecommendedSchools/>}/>
          <Route path="/board" element={<Board/>}/>
          

          <Route element={<AssessmentGuard />}>
            <Route path="/recommendations" element={<RecommendationsPage />} />
          </Route>
        </Route>
      </Route>

      {/* ── PROTÉGÉES : ADMIN SEULEMENT ────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin/fields"  element={<FieldsManagement />} />
          <Route path="/admin/schools" element={<SchoolsManagement />} />
        </Route>
      </Route>

      {/* ── PROTÉGÉES : COUNSELOR + ADMIN ──────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={["COUNSELOR", "ADMIN"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/counselor/sessions" element={<CounselorSessionsPage />} />
        </Route>
      </Route>

      {/* ── FALLBACK ───────────────────────────────────────────────── */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*"             element={<NotFoundPage />} />
    </Routes>
  );
}
