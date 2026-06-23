'use client';

import React from 'react';
import { useApp, AgentType } from '../context/AppContext';
import { Brain, Heart, BookOpen, DollarSign, Smile, MessageSquare, ArrowRight } from 'lucide-react';

export const DashboardSection: React.FC = () => {
  const { 
    toggles, 
    setToggle, 
    setCurrentPage, 
    setActiveChatAgent,
    setIsChatActive,
    layoutStyle,
    widgetSize
  } = useApp();

  const handleChatNow = (agent: AgentType) => {
    setActiveChatAgent(agent);
    setIsChatActive(true);
    setCurrentPage('dashboard');
  };

  const agents = [
    {
      id: 'medico' as const,
      name: 'Medico',
      role: 'Health AI',
      desc: 'Keeps your health in check, like a personal fitness heartbeat.',
      icon: Heart,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.1)',
    },
    {
      id: 'iris' as const,
      name: 'Iris',
      role: 'Work/Study AI',
      desc: 'Guides your study & work, a wise mentor at your side.',
      icon: BookOpen,
      color: '#8b5cf6',
      bgGlow: 'rgba(139, 92, 246, 0.1)',
    },
    {
      id: 'vault' as const,
      name: 'Vault',
      role: 'Finance AI',
      desc: 'Guards your money, plans your savings, and keeps you secure.',
      icon: DollarSign,
      color: '#3b82f6',
      bgGlow: 'rgba(59, 130, 246, 0.1)',
    },
    {
      id: 'vibe' as const,
      name: 'Vibe',
      role: 'Lifestyle AI',
      desc: 'Shapes your lifestyle, mood, and balance — your daily flow partner.',
      icon: Smile,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.1)',
    }
  ];

  const totalActive = Object.values(toggles).filter(Boolean).length;

  return (
    <div className={`dashboard-section animate-slide-in size-${widgetSize}`}>
      <div className="dashboard-welcome">
        <h2>Welcome Back, User!</h2>
        <p>How can I help you today? {totalActive}/4 AI Agents are currently active and synced.</p>
      </div>

      {/* NOVA Central AI Banner */}
      <div className="nova-banner glass animate-pulse-glow" onClick={() => handleChatNow('nova')}>
        <div className="nova-banner-left">
          <div className="nova-icon-circle">
            <Brain size={28} className="brain-pulse-icon" />
          </div>
          <div className="nova-banner-info">
            <h3>Chat with NOVA</h3>
            <p>Your central personal AI is here. Click to open the coordination workspace.</p>
          </div>
        </div>
        <div className="nova-banner-right">
          <span className="live-status">Central Brain</span>
          <ArrowRight size={20} className="arrow-icon" />
        </div>
      </div>

      {/* Grid or List layout for agents */}
      <div className={`agents-layout-${layoutStyle}`}>
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isActive = toggles[agent.id];

          return (
            <div 
              key={agent.id} 
              className={`agent-card glass ${isActive ? 'active' : 'inactive'}`}
              style={{ 
                '--accent-color': agent.color,
                '--accent-glow': agent.bgGlow
              } as React.CSSProperties}
            >
              <div className="agent-card-header">
                <div className="agent-icon-wrapper">
                  <Icon size={24} style={{ color: agent.color }} />
                </div>
                <div className="agent-meta">
                  <h4>{agent.name}</h4>
                  <span>{agent.role}</span>
                </div>
                <div className="agent-toggle-wrapper">
                  <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={isActive}
                      onChange={(e) => setToggle(agent.id, e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div className="agent-card-body">
                <p>{agent.desc}</p>
              </div>

              <div className="agent-card-footer">
                <button 
                  onClick={() => handleChatNow(agent.id)}
                  disabled={!isActive}
                  className="chat-btn"
                >
                  <MessageSquare size={16} />
                  <span>Chat with {agent.name}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .dashboard-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }



        .dashboard-welcome h2 {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .dashboard-welcome p {
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        /* NOVA central brain banner */
        .nova-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--secondary-rgb), 0.05) 100%);
          border-color: rgba(var(--primary-rgb), 0.2);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nova-banner:hover {
          border-color: rgba(var(--primary-rgb), 0.4);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(var(--primary-rgb), 0.1);
        }

        .nova-banner-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nova-icon-circle {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: rgba(var(--primary-rgb), 0.1);
          border: 1px solid rgba(var(--primary-rgb), 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .brain-pulse-icon {
          animation: brainPulse 2s infinite ease-in-out;
        }

        .nova-banner-info h3 {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .nova-banner-info p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .nova-banner-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .live-status {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--primary);
          background: rgba(var(--primary-rgb), 0.1);
          padding: 4px 12px;
          border-radius: 100px;
          border: 1px solid rgba(var(--primary-rgb), 0.2);
        }

        .arrow-icon {
          color: var(--text-muted);
          transition: transform 0.2s ease;
        }

        .nova-banner:hover .arrow-icon {
          transform: translateX(4px);
          color: var(--primary);
        }

        /* Agents Layout Grid */
        .agents-layout-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        /* Agents Layout List */
        .agents-layout-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .agent-card {
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .agent-card.active {
          border-color: var(--border-active);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .agent-card.inactive {
          opacity: 0.65;
        }

        .agent-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .agent-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--accent-glow);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .agent-meta {
          flex-grow: 1;
        }

        .agent-meta h4 {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
        }

        .agent-meta span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .agent-toggle-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }

        .status-badge {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .status-badge.active {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-badge.inactive {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Toggle switch styling */
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--bg-slider-inactive);
          transition: .3s;
          border: 1px solid var(--border-slider-inactive);
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 2px;
          bottom: 2px;
          background-color: var(--slider-knob);
          transition: .3s;
        }

        input:checked + .slider {
          background-color: var(--accent-color);
        }

        input:checked + .slider:before {
          transform: translateX(20px);
        }

        .slider.round {
          border-radius: 20px;
        }

        .slider.round:before {
          border-radius: 50%;
        }

        .agent-card-body p {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .agent-card-footer {
          display: flex;
          justify-content: flex-end;
        }

        .chat-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: var(--text-main);
          transition: all 0.2s ease;
          width: 100%;
          justify-content: center;
        }

        .chat-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.1) 0%, rgba(var(--secondary-rgb), 0.05) 100%);
          border-color: var(--accent-color);
          transform: translateY(-1px);
        }

        .chat-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        /* Compact Layout Modifiers */
        .size-compact .agent-card {
          padding: 16px;
        }

        .size-compact .agent-card-body p {
          margin-bottom: 12px;
        }

        @media (max-width: 900px) {
          .agents-layout-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
