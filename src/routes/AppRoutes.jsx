import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import TeacherDashboard from "../pages/dashboard/TeacherDashboard";
import Dashboard from "../pages/dashboard/Dashboard";
import SuperAdminDashboard from "../pages/dashboard/SuperAdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute"; // ⬅️ Import this
import OrganizationSetup from "../pages/OrganizationSetup";
import OrganizationList from "../pages/OrganizationList";
import ClassLevelList from "../pages/admin/ClassLevelList";
import ClassLevelSetup from "../pages/admin/ClassLevelSetup";
import DifficultyLevelSetup from "../pages/admin/DifficultyLevelSetup";
import DifficultyLevelList from "../pages/admin/DifficultyLevelList";
import QuestionTypeSetup from "../pages/admin/QuestionTypeSetup";
import QuestionTypeList from "../pages/admin/QuestionTypeList";
import SubjectSetup from "../pages/admin/SubjectSetup";
import SubjectList from "../pages/admin/SubjectList";
import AdminList from "../pages/admin/AdminList";
import TeacherList from "../pages/teacher/TeacherList";
import CreateQuestionPage from "../pages/teacher/CreateQuestionPage";
import QuestionList from "../pages/teacher/QuestionList";
import ExamPaperCreate from "../pages/teacher/ExamPaperCreate";
import ExamPaperList from "../pages/teacher/ExamPaperList";
import ExamPaperDownload from "../pages/teacher/ExamPaperDownload";
import AdminSetup from "../pages/superadmin/AdminSetup";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
  <Route path="/" element={<Home />} />
  <Route path="/dashboard" element={<Dashboard />} />

  {/* Public Route Wrapper */}
  <Route element={<PublicRoute />}>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    
  </Route>
</Route>


      {/* Admin Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN_ACCESS"]} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/organization-list" element={<OrganizationList />} />
          <Route path="/dashboard/admin/organization-setup" element={<OrganizationSetup />} />
          <Route path="/dashboard/admin/classLevel-list" element={<ClassLevelList />} />
          <Route path="/dashboard/admin/classLevel-setup" element={<ClassLevelSetup />} />
          <Route path="/dashboard/admin/difficultyLevel-list" element={<DifficultyLevelList />} />
          <Route path="/dashboard/admin/difficultyLevel-setup" element={<DifficultyLevelSetup />} />
          <Route path="/dashboard/admin/questionType-list" element={<QuestionTypeList />} />
          <Route path="/dashboard/admin/questionType-setup" element={<QuestionTypeSetup />} />
          <Route path="/dashboard/admin/subject-list" element={<SubjectList />} />
          <Route path="/dashboard/admin/subject-setup" element={<SubjectSetup />} />
          <Route path="/dashboard/admin/teacher-list" element={<TeacherList />} />
        </Route>
      </Route>

      {/* Teacher Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["TEACHER_ACCESS"]} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
        </Route>
      </Route>

      {/* Super Admin Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN_ACCESS"]} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/dashboard/super-admin/admin-list" element={<AdminList />} />
          <Route path="/dashboard/super-admin/admin-setup" element={<AdminSetup />} />
        </Route>
      </Route>

      {/* Create Question */}
      <Route element={<ProtectedRoute allowedRoles={["CREATE_QUESTION"]} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard/create-question" element={<CreateQuestionPage />} />
          <Route path="/dashboard/create-question-new" element={<CreateQuestionPage />} />
          <Route path="/dashboard/question-list" element={<QuestionList />} />
        </Route>
      </Route>

      {/* Exam Paper */}
      <Route element={<ProtectedRoute allowedRoles={["CREATE_EXAM_PAPER"]} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard/create-exam-paper" element={<ExamPaperCreate />} />
          <Route path="/dashboard/exam-paper-list" element={<ExamPaperList />} />
          <Route path="/dashboard/exam-paper-download" element={<ExamPaperDownload />} />
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
