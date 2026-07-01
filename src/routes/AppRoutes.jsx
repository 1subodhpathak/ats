import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import ATSCheckStart from "../pages/ATSCheckStart";
import ATSJobDetailsPage from "../pages/ATSJobDetailsPage";
import ATSReportPage from "../pages/ATSReportPage";
import ATSResumeUploadPage from "../pages/ATSResumeUploadPage";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Repository from "../pages/Repository";
import UploadResume from "../pages/UploadResume";
import { ResumeGamePage } from "../resume-game";
import ProtectedRoute from "../components/common/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-ats"
          element={
            <ProtectedRoute>
              <ATSCheckStart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-ats/resume"
          element={
            <ProtectedRoute>
              <ATSResumeUploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-ats/resume-jd"
          element={
            <ProtectedRoute>
              <ATSResumeUploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-ats/resume-jd/job-details"
          element={
            <ProtectedRoute>
              <ATSJobDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadResume />
            </ProtectedRoute>
          }
        />
        <Route
          path="/play-with-resume"
          element={
            <ProtectedRoute>
              <ResumeGamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/analysis/:analysisId"
          element={
            <ProtectedRoute>
              <ATSReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/repository"
          element={
            <ProtectedRoute>
              <Repository />
            </ProtectedRoute>
          }
        />
        <Route
          path="/repository/report/:reportId"
          element={
            <ProtectedRoute>
              <ATSReportPage />
            </ProtectedRoute>
          }
        />
        <Route path="/analysis" element={<Navigate to="/check-ats" replace />} />
        <Route path="/editor" element={<Navigate to="/dashboard" replace />} />
        <Route path="/preview" element={<Navigate to="/dashboard" replace />} />
        <Route path="/history" element={<Navigate to="/repository" replace />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
