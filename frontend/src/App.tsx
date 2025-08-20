import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UIAgentProvider } from './contexts/UIAgentContext';
import Header from './components/Header';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './components/AdminDashboard';
import Features from './pages/Features';
import Contact from './pages/Contact';

function App() {
  return (
    <UIAgentProvider>
      <Router>
        <div className="min-h-screen bg-tech-black">
          <Header />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agent-dashboard" element={<AgentDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/features" element={<Features />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <ChatBot />
        </div>
      </Router>
    </UIAgentProvider>
  );
}

export default App;