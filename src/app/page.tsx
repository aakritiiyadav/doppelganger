'use client';

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp, PageType } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { DashboardSection } from '../components/DashboardSection';
import { ChatSection } from '../components/ChatSection';
import { InsightsSection } from '../components/InsightsSection';
import { CustomizationsSection } from '../components/CustomizationsSection';
import { ProfileSection } from '../components/ProfileSection';
import { ChevronLeft } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentPage, setCurrentPage, isChatActive, setIsChatActive, collapsibleSidebar } = useApp();

  // Reset chat view when switching pages from sidebar
  useEffect(() => {
    setIsChatActive(false);
  }, [currentPage, setIsChatActive]);

  if (currentPage === 'welcome') {
    return <WelcomeScreen />;
  }

  const renderActiveSection = () => {
    switch (currentPage) {
      case 'dashboard':
        if (isChatActive) {
          return (
            <div className="chat-layout-wrapper">
              <button 
                onClick={() => {
                  setIsChatActive(false);
                  // We don't clear activeChatAgent so they can resume,
                  // but we reset so clicking again works.
                }} 
                className="back-overview-btn"
              >
                <ChevronLeft size={16} />
                <span>Back to Overview</span>
              </button>
              <ChatSection />
            </div>
          );
        }
        return <DashboardSection />;
      case 'insights':
        return <InsightsSection />;
      case 'customizations':
        return <CustomizationsSection />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className={`app-layout ${collapsibleSidebar ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="app-main-content">
        <Header />
        <main className="app-page-body">
          {renderActiveSection()}
        </main>
      </div>

      <style jsx global>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-app);
          color: var(--text-main);
        }

        .app-main-content {
          margin-left: var(--sidebar-width);
          flex-grow: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        :global(.sidebar-collapsed) .app-main-content {
          margin-left: 70px !important;
        }

        .app-page-body {
          padding: 0 32px 32px 32px;
          flex-grow: 1;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }

        .chat-layout-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .back-overview-btn {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
          transition: color 0.2s ease;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .back-overview-btn:hover {
          color: var(--primary);
          background: rgba(255, 255, 255, 0.03);
        }

        @media (max-width: 768px) {
          .app-main-content {
            margin-left: 70px;
          }
          .app-page-body {
            padding: 0 16px 24px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default function Home() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
