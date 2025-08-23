import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UIAgentProvider } from './contexts/UIAgentContext';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AgentDashboard from './pages/AgentDashboard';
import Features from './pages/Features';
import Contact from './pages/Contact';
import './App.css';

// Authentication pages component
const AuthPages: React.FC = () => {
  const [authMode, setAuthMode] = React.useState<'login' | 'signup' | 'forgot-password'>('login');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {authMode === 'login' && (
        <LoginForm
          onSuccess={() => {
            // Redirect to dashboard after successful login
            navigate('/dashboard');
          }}
          onSwitchToSignup={() => setAuthMode('signup')}
          onSwitchToForgotPassword={() => setAuthMode('forgot-password')}
        />
      )}
      {authMode === 'signup' && (
        <SignupForm
          onSuccess={() => {
            setAuthMode('login');
            alert('Registration successful! Please check your email to verify your account.');
          }}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      )}
      {authMode === 'forgot-password' && (
        <ForgotPasswordForm
          onSuccess={() => {
            // Success message is shown in the component
          }}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      )}
    </div>
  );
};

// Header component with navigation
const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">Club Run</Link>
          </div>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user?.firstName || user?.email}!
                </span>
                <Link to="/dashboard" className="text-blue-600 hover:text-blue-700">Dashboard</Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

// Main app content with routing
const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<AuthPages />} />
            <Route path="/agent-dashboard" element={<AgentDashboard />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <ChatBot />
      </div>
    </Router>
  );
};

// Main App component with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <UIAgentProvider>
        <AppContent />
      </UIAgentProvider>
    </AuthProvider>
  );
};

export default App;