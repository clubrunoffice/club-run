import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrivyAuthProvider } from './contexts/PrivyAuthContext';
import { UIAgentProvider } from './contexts/UIAgentContext';
import { RBACProvider } from './contexts/RBACContext';
import { RoleBasedNavigation, RoleBasedDashboard } from './components/RoleBasedUI';
import { ProtectedRoute } from './components/ProtectedRoutePrivy';
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
import Profile from './pages/Profile';
import UserManagement from './pages/admin/UserManagement';
import SystemAnalytics from './pages/admin/SystemAnalytics';
import './App.css';

// Main app content with routing
const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <RoleBasedNavigation />
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
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
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/stats" 
              element={
                <ProtectedRoute>
                  <SystemAnalytics />
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

// Main App component with PrivyAuthProvider and RBACProvider
const App: React.FC = () => {
  return (
    <PrivyAuthProvider>
      <RBACProvider>
        <UIAgentProvider>
          <AppContent />
        </UIAgentProvider>
      </RBACProvider>
    </PrivyAuthProvider>
  );
};

export default App;