import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyResetOtp from "./pages/auth/VerifyResetOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import Home from "./pages/Home";
import StudentDashboard from "./pages/student/StudentDashboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateCourse from "./pages/instructor/CreateCourse";
import CreateLesson from "./pages/instructor/CreateLesson";
import MyCourses from "./pages/instructor/MyCourses";
import InstructorStudents from "./pages/instructor/InstructorStudents";
import StudentMyCourses from "./pages/student/MyCourses";
import CoursePlayer from "./pages/student/CoursePlayer";
import Payment from "./pages/student/Payment";
import CourseDetails from "./pages/CourseDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PaymentSuccess from "./pages/student/PaymentSuccess";
import PaymentCancel from "./pages/student/PaymentCancel";
import LessonExam from "./pages/student/LessonExam";
import CreateExam from "./pages/instructor/CreateExam";
import ExamResult from "./pages/student/ExamResult";
import Plans from "./pages/student/Plans";

import "./styles/base.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/login" element={<Login />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* 🔐 STUDENT */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* 🔐 INSTRUCTOR */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute allowedRole="instructor">
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/create-course"
            element={
              <ProtectedRoute allowedRole="instructor">
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/create-lesson/:courseId"
            element={
              <ProtectedRoute allowedRole="instructor">
                <CreateLesson />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/my-courses"
            element={
              <ProtectedRoute allowedRole="instructor">
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/students"
            element={
              <ProtectedRoute allowedRole="instructor">
                <InstructorStudents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/course/:courseId"
            element={
              <ProtectedRoute allowedRole="student">
                <CoursePlayer />
              </ProtectedRoute>
            }
          />
          <Route path="/payment/:courseId" element={
            <ProtectedRoute allowedRole="student">
              <Payment />
            </ProtectedRoute>
          } />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />

          {/* 🔐 ADMIN */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/my-courses"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentMyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/create-exam"
            element={
              <ProtectedRoute allowedRole="instructor">
                <CreateExam />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/exam/:courseId/:lessonId"
            element={
              <ProtectedRoute allowedRole="student">
                <LessonExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/exam-result/:courseId/:lessonId"
            element={
              <ProtectedRoute allowedRole="student">
                <ExamResult />
              </ProtectedRoute>
            }
          />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
