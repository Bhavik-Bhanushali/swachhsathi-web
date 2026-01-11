import { Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import WorkerListPage from './pages/WorkerListPage';
import WorkerDetailPage from './pages/WorkerDetailPage';
import ReportDetailsPage from './pages/ReportDetailsPage';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignInPage />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/report-details/:reportId"
            element={
              <ProtectedRoute>
                <ReportDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/worker/:workerId"
            element={
              <ProtectedRoute>
                <WorkerDetailPage />
              </ProtectedRoute>
            }
          />
        
      </Routes>
    </>
  );
};

export default App;
