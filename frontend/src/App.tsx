import { Navigate, Route, Routes } from "react-router";
import PublicRoute from "./components/Auth/AuthorizeRoute";
import RoleProtectedRoute from "./components/Auth/RoleProtected";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import DeanDashboard from "./pages/Dean of student/Dashboard";
import DeanHomePage from "./pages/Dean of student/HomePage";
import StudentAttendance from "./pages/Dean of student/Student";
import TeacherAttendance from "./pages/Dean of student/Teacher";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherHomePage from "./pages/teacher/HomePage";
import TeacherResult from "./pages/teacher/Result";
import Teacherplan from "./pages/teacher/plan";
import ViceDashboard from "./pages/vice principle/Dashboard";
import Enrollments from "./pages/vice principle/Enrollments";
import HomePage from "./pages/vice principle/HomePage";
import VpResults from "./pages/vice principle/Results";
import Roles from "./pages/vice principle/Roles";
import VpStudents from "./pages/vice principle/Students";
import VpSubjects from "./pages/vice principle/Subjects";
import VpTeacher from "./pages/vice principle/Teacher";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* TODO:  add protected route */}
      
      <Route
        path="/vice-principal"
        element={<RoleProtectedRoute allowedRoles={["vice principle"]} />}
      >
        <Route element={<ViceDashboard />}>
          <Route index element={<HomePage />} />
          <Route path="students" element={<VpStudents />} />
          <Route path="teachers" element={<VpTeacher />} />
          <Route path="subjects" element={<VpSubjects/>} />
          <Route path="enrolls" element={<Enrollments />} />
          <Route path="results" element={<VpResults/>} />
          <Route path="roles" element={<Roles/>} />
        </Route>
      </Route>

      {/* teacher role */}
      <Route
        path="/teacher"
        element={<RoleProtectedRoute allowedRoles={["teacher"]} />}
      >
        <Route  element={<TeacherDashboard />}>
          <Route index element={<TeacherHomePage />} />
          <Route path="result" element={<TeacherResult />} />
          <Route path="plan" element={<Teacherplan />} />
        </Route>
      </Route>
     {/* Dean of Student  */}
     <Route
        path="/dean"
        element={<RoleProtectedRoute allowedRoles={["dean of students"]} />}
      >
        <Route  element={<DeanDashboard />}>
          <Route index element={<DeanHomePage />} />
          <Route path="student" element={<StudentAttendance/>} />
          <Route path="teacher" element={<TeacherAttendance />} />
          {/* <Route path="mysubjects" element={<Mysubject/>} /> */}
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
