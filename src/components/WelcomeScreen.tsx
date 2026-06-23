'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, Heart, DollarSign, BookOpen, Smile } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { setCurrentPage } = useApp();

  const previewAgents = [
    { name: 'Medico', role: 'Health', desc: 'Keeps your health in check, like a personal fitness heartbeat.', icon: Heart, color: '#10b981' },
    { name: 'Iris', role: 'Work/Study', desc: 'Guides your study & work, a wise mentor at your side.', icon: BookOpen, color: '#8b5cf6' },
    { name: 'Vault', role: 'Finance', desc: 'Guards your money, plans your savings, and keeps you secure.', icon: DollarSign, color: '#3b82f6' },
    { name: 'Vibe', role: 'Lifestyle', desc: 'Shapes your lifestyle, mood, and balance — your daily flow partner.', icon: Smile, color: '#f59e0b' }
  ];

  return (
    <div className="welcome-container">
      <div className="background-glows">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
      </div>

      <div className="welcome-content glass">
        <div className="welcome-badge">
          <Sparkles size={14} className="badge-icon" />
          <span>YOUR DIGITAL DOPPELGÄNGER</span>
        </div>

        <h1 className="welcome-title">
          All Your AI Agents in One Place
        </h1>

        <p className="welcome-subtitle">
          Manage Health, Finance, Study, and Lifestyle. Personalized AI, always under your control.
        </p>

        <button onClick={() => setCurrentPage('dashboard')} className="enter-btn animate-pulse-glow">
          <span>Open Dashboard</span>
          <div className="btn-glow"></div>
        </button>

        <div className="welcome-agents-grid">
          {previewAgents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div key={agent.name} className="agent-preview-card" style={{ '--agent-color': agent.color } as React.CSSProperties}>
                <div className="agent-preview-icon-wrapper">
                  <Icon size={24} style={{ color: agent.color }} />
                </div>
                <h3>{agent.name}</h3>
                <span className="agent-preview-role">{agent.role}</span>
                <p>{agent.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="welcome-footer-tag">
          <Shield size={16} />
          <span>Privacy Guaranteed: All agent reasoning runs with explicit user consent.</span>
        </div>
      </div>

      <style jsx>{`
        .welcome-container {
          min-height: 100vh;
          width: 100vw;
          background-color: #050508;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }

        .background-glows {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 1;
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(150px);
          opacity: 0.15;
        }

        .glow-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
          top: -100px;
          right: -100px;
        }

        .glow-2 {
          width: 650px;
          height: 650px;
          background: radial-gradient(circle, var(--secondary) 0%, transparent 70%);
          bottom: -150px;
          left: -150px;
        }

        .welcome-content {
          max-width: 960px;
          width: 100%;
          padding: 60px 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .welcome-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 100px;
          background: rgba(var(--primary-rgb), 0.1);
          border: 1px solid rgba(var(--primary-rgb), 0.2);
          color: var(--primary);
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 24px;
          text-transform: uppercase;
        }

        .badge-icon {
          animation: float 2s infinite ease-in-out;
        }

        .welcome-title {
          font-family: var(--font-display);
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -1px;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #ffffff 40%, rgba(255, 255, 255, 0.7) 70%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .welcome-subtitle {
          font-size: 1.15rem;
          color: var(--text-muted);
          max-width: 600px;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .enter-btn {
          padding: 16px 48px;
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          border-radius: 50px;
          border: none;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 10;
          cursor: pointer;
        }

        .enter-btn:hover {
          transform: translateY(-3px) scale(1.02);
          filter: brightness(1.1);
        }

        .enter-btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        .welcome-agents-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          width: 100%;
          margin-top: 60px;
          margin-bottom: 40px;
        }

        .agent-preview-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 24px 16px;
          text-align: left;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .agent-preview-card:hover {
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }

        .agent-preview-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }



        .agent-preview-card h3 {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }

        .agent-preview-role {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 12px;
        }

        .agent-preview-card p {
          font-size: 0.825rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .welcome-footer-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--text-muted);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 24px;
          width: 100%;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .welcome-agents-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .welcome-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 600px) {
          .welcome-agents-grid {
            grid-template-columns: 1fr;
          }
          .welcome-content {
            padding: 40px 20px;
          }
          .welcome-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};
