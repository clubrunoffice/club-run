'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { CopilotChat } from '../copilot/CopilotChat';
import { FloatingActionButton } from '../ui/FloatingActionButton';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { copilotOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop/Tablet Sidebar */}
      <DesktopSidebar />
      
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Main Content */}
      <main className={`
        transition-all duration-300
        lg:ml-80 md:ml-64
        pt-16 lg:pt-0
        pb-20 md:pb-0
      `}>
        <div className="min-h-screen">
          {children}
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
      
      {/* AI Copilot Chat */}
      {copilotOpen && <CopilotChat />}
      
      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}; 