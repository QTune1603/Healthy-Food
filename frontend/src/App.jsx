import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserLayout from './layouts/UserLayout';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import AccountPage from './pages/user/Account';
import Blog from './pages/blog/Blog';
import BlogDetail from './pages/blog/BlogDetail';
import BodyIndex from './pages/health/BodyIndex';
import Calories from './pages/health/Calories';
import Calculator from './pages/health/Calculator';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
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
      </Router>
    </AuthProvider>
  );
}

export default App;
