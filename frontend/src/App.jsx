import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load components
const UserLayout = lazy(() => import('./layouts/UserLayout'));
const LoginPage = lazy(() => import('./pages/auth/Login'));
const RegisterPage = lazy(() => import('./pages/auth/Register'));
const AccountPage = lazy(() => import('./pages/user/Account'));
const Blog = lazy(() => import('./pages/blog/Blog'));
const BlogDetail = lazy(() => import('./pages/blog/BlogDetail'));
const BodyIndex = lazy(() => import('./pages/health/BodyIndex'));
const Calories = lazy(() => import('./pages/health/Calories'));
const Calculator = lazy(() => import('./pages/health/Calculator'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/blog" replace />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:id" element={<BlogDetail />} />
              <Route path="body-index" element={<BodyIndex />} />
              <Route path="calories" element={<Calories />} />
              <Route path="calculator" element={<Calculator />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
