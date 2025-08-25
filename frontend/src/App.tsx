import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UIAgentProvider } from './contexts/UIAgentContext';
import { RBACProvider } from './contexts/RBACContext';
import { RoleBasedNavigation, RoleBasedDashboard } from './components/RoleBasedUI';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import AgentDashboard from './pages/AgentDashboard';
import EnhancedAgentDashboard from './pages/EnhancedAgentDashboard';
import Features from './pages/Features';
import Contact from './pages/Contact';
import { P2PMissions } from './pages/P2PMissions';
import { Missions } from './pages/Missions';
import MissionCreate from './pages/MissionCreate';
import DynamicPayoutSystem from './components/payments/DynamicPayoutSystem';
import MissionTest from './pages/MissionTest';
import { CuratorDashboardPage } from './pages/CuratorDashboard';
import CuratorThankYou from './pages/CuratorThankYou';
import ChatGPTAnalytics from './components/admin/ChatGPTAnalytics';
import './App.css';

// Authentication pages component
const AuthPages: React.FC = () => {
  const [authMode, setAuthMode] = React.useState<'login' | 'signup' | 'forgot-password'>('login');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to homepage if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {authMode === 'login' && (
        <LoginForm
          onSuccess={() => {
            // Redirect to homepage after successful login
            navigate('/');
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

// Header component with navigation - using RoleBasedNavigation for RBAC
const Header: React.FC = () => {
  return <RoleBasedNavigation />;
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
            <Route path="/enhanced-agent-dashboard" element={<EnhancedAgentDashboard />} />
            <Route path="/curator-thank-you" element={<CuratorThankYou />} />
            <Route path="/mission-test" element={<MissionTest />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <RoleBasedDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/missions" 
              element={
                <ProtectedRoute>
                  <Missions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/missions/create" 
              element={
                <ProtectedRoute>
                  <MissionCreate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/p2p-missions" 
              element={
                <ProtectedRoute>
                  <P2PMissions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/expenses" 
              element={
                <ProtectedRoute>
                  <DynamicPayoutSystem />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/curator-dashboard" 
              element={
                <ProtectedRoute>
                  <CuratorDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chatgpt-analytics" 
              element={
                <ProtectedRoute>
                  <ChatGPTAnalytics />
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

// Main App component with AuthProvider and RBACProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <RBACProvider>
        <UIAgentProvider>
          <AppContent />
        </UIAgentProvider>
      </RBACProvider>
    </AuthProvider>
  );
};

export default App;