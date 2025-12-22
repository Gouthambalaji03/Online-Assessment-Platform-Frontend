import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import VerifyEmail from './Pages/VerifyEmail';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import Unauthorized from './Pages/Unauthorized';

import StudentDashboard from './Pages/StudentDashboard';
import AvailableExams from './Pages/AvailableExams';
import MyExams from './Pages/MyExams';
import TakeExam from './Pages/TakeExam';
import ExamInstructions from './Pages/ExamInstructions';
import Results from './Pages/Results';
import PerformanceTrends from './Pages/PerformanceTrends';
import Profile from './Pages/Profile';

import AdminDashboard from './Pages/Admin/AdminDashboard';
import ManageExams from './Pages/Admin/ManageExams';
import CreateExam from './Pages/Admin/CreateExam';
import QuestionBank from './Pages/Admin/QuestionBank';
import CreateQuestion from './Pages/Admin/CreateQuestion';
import ManageUsers from './Pages/Admin/ManageUsers';
import Proctoring from './Pages/Admin/Proctoring';
import ProctorAssignment from './Pages/Admin/ProctorAssignment';
import PendingGrading from './Pages/Admin/PendingGrading';
import ManualGrading from './Pages/Admin/ManualGrading';
import Analytics from './Pages/Admin/Analytics';

import ProctorDashboard from './Pages/Proctor/ProctorDashboard';
import LiveSessions from './Pages/Proctor/LiveSessions';
import FlaggedExams from './Pages/Proctor/FlaggedExams';
import ActivityLogs from './Pages/Proctor/ActivityLogs';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/dashboard" element={
            <ProtectedRoute roles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/exams" element={
            <ProtectedRoute roles={['student']}>
              <AvailableExams />
            </ProtectedRoute>
          } />
          <Route path="/my-exams" element={
            <ProtectedRoute roles={['student']}>
              <MyExams />
            </ProtectedRoute>
          } />
          <Route path="/exam/:examId/start" element={
            <ProtectedRoute roles={['student']}>
              <ExamInstructions />
            </ProtectedRoute>
          } />
          <Route path="/exam/:examId/take" element={
            <ProtectedRoute roles={['student']}>
              <TakeExam />
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute roles={['student']}>
              <Results />
            </ProtectedRoute>
          } />
          <Route path="/trends" element={
            <ProtectedRoute roles={['student']}>
              <PerformanceTrends />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/exams" element={
            <ProtectedRoute roles={['admin']}>
              <ManageExams />
            </ProtectedRoute>
          } />
          <Route path="/admin/exams/create" element={
            <ProtectedRoute roles={['admin']}>
              <CreateExam />
            </ProtectedRoute>
          } />
          <Route path="/admin/exams/:examId/edit" element={
            <ProtectedRoute roles={['admin']}>
              <CreateExam />
            </ProtectedRoute>
          } />
          <Route path="/admin/questions" element={
            <ProtectedRoute roles={['admin']}>
              <QuestionBank />
            </ProtectedRoute>
          } />
          <Route path="/admin/questions/create" element={
            <ProtectedRoute roles={['admin']}>
              <CreateQuestion />
            </ProtectedRoute>
          } />
          <Route path="/admin/questions/:questionId/edit" element={
            <ProtectedRoute roles={['admin']}>
              <CreateQuestion />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}>
              <ManageUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/proctoring" element={
            <ProtectedRoute roles={['admin']}>
              <Proctoring />
            </ProtectedRoute>
          } />
          <Route path="/admin/exams/:examId/proctors" element={
            <ProtectedRoute roles={['admin']}>
              <ProctorAssignment />
            </ProtectedRoute>
          } />
          <Route path="/admin/grading" element={
            <ProtectedRoute roles={['admin']}>
              <PendingGrading />
            </ProtectedRoute>
          } />
          <Route path="/admin/grading/:resultId" element={
            <ProtectedRoute roles={['admin']}>
              <ManualGrading />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute roles={['admin']}>
              <Analytics />
            </ProtectedRoute>
          } />

          <Route path="/proctor" element={
            <ProtectedRoute roles={['proctor', 'admin']}>
              <ProctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/proctor/sessions" element={
            <ProtectedRoute roles={['proctor', 'admin']}>
              <LiveSessions />
            </ProtectedRoute>
          } />
          <Route path="/proctor/flags" element={
            <ProtectedRoute roles={['proctor', 'admin']}>
              <FlaggedExams />
            </ProtectedRoute>
          } />
          <Route path="/proctor/logs" element={
            <ProtectedRoute roles={['proctor', 'admin']}>
              <ActivityLogs />
            </ProtectedRoute>
          } />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Router>
    </AuthProvider>
  );
};

export default App;
