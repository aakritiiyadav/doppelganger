'use client';

import React from 'react';
import { useApp, PageType } from '../context/AppContext';
import { LayoutDashboard, TrendingUp, Sliders, User, LogOut, Cpu } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, setIsChatActive, collapsibleSidebar } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'customizations', label: 'Customizations', icon: Sliders },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <aside className={`sidebar-container ${collapsibleSidebar ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <Cpu size={24} className="logo-icon" />
        <span className="logo-text">NOVA LINK</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setIsChatActive(false);
                setCurrentPage(item.id as PageType);
              }}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => setCurrentPage('welcome')} className="sidebar-nav-item logout-btn">
          <LogOut size={20} className="nav-icon" />
          <span className="nav-label">Logout</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar-container {
          width: var(--sidebar-width);
          background: var(--bg-sidebar);
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border-card);
          padding: 24px 16px;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
          overflow: hidden;
        }

        :global(.sidebar-container.collapsed) {
          width: 70px !important;
          padding: 24px 8px !important;
        }

        :global(.sidebar-container.collapsed .logo-text),
        :global(.sidebar-container.collapsed .nav-label) {
          display: none !important;
        }

        :global(.sidebar-container.collapsed .sidebar-logo) {
          justify-content: center !important;
          padding-bottom: 24px !important;
        }

        :global(.sidebar-container.collapsed .sidebar-nav-item) {
          justify-content: center !important;
          padding: 12px !important;
          gap: 0 !important;
        }

        :global(.sidebar-container.collapsed .sidebar-nav-item.active) {
          padding-left: 10px !important;
          border-left: 2px solid var(--primary) !important;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px 32px 12px;
          color: #fff;
        }

        .logo-icon {
          color: var(--primary);
          animation: float 3s infinite ease-in-out;
        }

        .logo-text {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 1px;
          background: linear-gradient(135deg, #fff 30%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          color: var(--text-muted);
          background: transparent !important;
          border: none !important;
          outline: none !important;
          border-radius: 12px;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
          font-weight: 500;
          cursor: pointer;
        }

        .sidebar-nav-item:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05) !important;
        }

        .sidebar-nav-item.active {
          color: #fff;
          background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.2) 0%, rgba(var(--secondary-rgb), 0.1) 100%) !important;
          border-left: 3px solid var(--primary) !important;
          padding-left: 13px;
          box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.1);
        }

        .nav-icon {
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .sidebar-nav-item:hover .nav-icon {
          transform: translateX(2px);
        }

        .logout-btn {
          margin-top: auto;
          background: transparent !important;
          border: none !important;
          cursor: pointer;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .sidebar-container {
            width: 70px;
            padding: 24px 8px;
          }
          .logo-text, .nav-label {
            display: none;
          }
          .sidebar-logo {
            justify-content: center;
            padding-bottom: 24px;
          }
          .sidebar-nav-item {
            justify-content: center;
            padding: 12px;
          }
          .sidebar-nav-item.active {
            padding-left: 10px;
            border-left: 2px solid var(--primary);
          }
        }
      `}</style>
    </aside>
  );
};
