'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Layout, Palette, BellRing, Sliders, Check } from 'lucide-react';

export const CustomizationsSection: React.FC = () => {
  const {
    layoutStyle,
    setLayoutStyle,
    widgetSize,
    setWidgetSize,
    autoRefresh,
    setAutoRefresh,
    showBreadcrumbs,
    setShowBreadcrumbs,
    collapsibleSidebar,
    setCollapsibleSidebar,
    
    theme,
    setTheme,
    fontSize,
    setFontSize,
    colorScheme,
    setColorScheme,

    modelUpdates,
    setModelUpdates,
    systemMaintenance,
    setSystemMaintenance,
    performanceInsights,
    setPerformanceInsights
  } = useApp();

  const colorSchemesList = [
    { id: 'scheme-1' as const, name: 'Pink & Purple Accent', primary: '#ec4899', secondary: '#8b5cf6' },
    { id: 'scheme-2' as const, name: 'Midnight Blue Accent', primary: '#3b82f6', secondary: '#6366f1' },
    { id: 'scheme-3' as const, name: 'Emerald Green Accent', primary: '#10b981', secondary: '#059669' },
    { id: 'scheme-4' as const, name: 'Neon Cyan Accent', primary: '#06b6d4', secondary: '#1d4ed8' }
  ];

  return (
    <div className="customizations-container animate-slide-in">
      <div className="customizer-layout">
        {/* Left Side: Layout Settings */}
        <div className="customizer-card glass">
          <div className="card-header-icon">
            <Layout size={20} className="header-icon" />
            <h3>Dashboard Layout</h3>
          </div>
          <p className="card-subtitle">Choose how your dashboard is organized and displays content.</p>

          <div className="settings-fields-group">
            <div className="setting-row">
              <div className="setting-label-col">
                <strong>Layout Style</strong>
                <span>Set grid layout or full width list view.</span>
              </div>
              <select 
                value={layoutStyle} 
                onChange={(e) => setLayoutStyle(e.target.value as 'grid' | 'list')}
                className="custom-select"
              >
                <option value="grid">Grid Layout</option>
                <option value="list">List Layout</option>
              </select>
            </div>

            <div className="setting-row">
              <div className="setting-label-col">
                <strong>Widget Size</strong>
                <span>Adjust dashboard spacing density.</span>
              </div>
              <select 
                value={widgetSize} 
                onChange={(e) => setWidgetSize(e.target.value as 'standard' | 'compact')}
                className="custom-select"
              >
                <option value="standard">Standard Size</option>
                <option value="compact">Compact Size</option>
              </select>
            </div>

            <div className="setting-divider"></div>

            <div className="toggle-row">
              <div className="setting-label-col">
                <strong>Auto-refresh Data</strong>
                <span>Automatically sync insights data every 60s.</span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="toggle-row">
              <div className="setting-label-col">
                <strong>Show Breadcrumbs</strong>
                <span>Show route navigation path in header.</span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={showBreadcrumbs}
                  onChange={(e) => setShowBreadcrumbs(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="toggle-row">
              <div className="setting-label-col">
                <strong>Collapsible Sidebar</strong>
                <span>Collapse sidebar on smaller screen sizes.</span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={collapsibleSidebar}
                  onChange={(e) => setCollapsibleSidebar(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>

          </div>
        </div>

        {/* Right Side: Appearance & Themes */}
        <div className="customizer-card glass">
          <div className="card-header-icon">
            <Palette size={20} className="header-icon" />
            <h3>Appearance Settings</h3>
          </div>
          <p className="card-subtitle">Customize the colors, theme, and notifications of your workspace.</p>

          <div className="settings-fields-group">
            <div className="setting-row">
              <div className="setting-label-col">
                <strong>Display Theme</strong>
                <span>Switch between dark and light aesthetics.</span>
              </div>
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
                className="custom-select"
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
              </select>
            </div>

            <div className="setting-row">
              <div className="setting-label-col">
                <strong>Font Size</strong>
                <span>Scale workspace text layout.</span>
              </div>
              <select 
                value={fontSize} 
                onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
                className="custom-select"
              >
                <option value="small">Small Text</option>
                <option value="medium">Medium Text</option>
                <option value="large">Large Text</option>
              </select>
            </div>

            <div className="setting-divider"></div>

            <div className="color-scheme-selector">
              <strong>Color Scheme Palette</strong>
              <span className="caption-sub">Dynamically updates application accent variables.</span>
              
              <div className="color-circles-grid">
                {colorSchemesList.map((scheme) => (
                  <button
                    key={scheme.id}
                    className={`color-circle-btn ${colorScheme === scheme.id ? 'selected' : ''}`}
                    style={{ 
                      background: `linear-gradient(135deg, ${scheme.primary} 0%, ${scheme.secondary} 100%)`
                    }}
                    onClick={() => setColorScheme(scheme.id)}
                    title={scheme.name}
                  >
                    {colorScheme === scheme.id && <Check size={18} className="check-icon" />}
                  </button>
                ))}
              </div>
              <span className="active-scheme-label">
                Active Accent: {colorSchemesList.find(c => c.id === colorScheme)?.name}
              </span>
            </div>

            <div className="setting-divider"></div>

            <div className="sub-panel">
              <div className="sub-panel-title">
                <BellRing size={16} className="sub-icon" />
                <h4>Notification Preferences</h4>
              </div>
              <span className="caption-sub">Control when and how you receive alerts.</span>

              <div className="toggle-row gap-top">
                <div className="setting-label-col">
                  <strong>Model Updates</strong>
                  <span>Notify when specialized AIs compile learning rules.</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={modelUpdates}
                    onChange={(e) => setModelUpdates(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="toggle-row">
                <div className="setting-label-col">
                  <strong>System Maintenance</strong>
                  <span>Alert on scheduled server optimizations.</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox"
                    checked={systemMaintenance}
                    onChange={(e) => setSystemMaintenance(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="toggle-row">
                <div className="setting-label-col">
                  <strong>Performance Insights</strong>
                  <span>Send summary reports of weekly chat interactions.</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={performanceInsights}
                    onChange={(e) => setPerformanceInsights(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .customizations-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .customizer-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .customizer-card {
          padding: 28px;
        }

        .card-header-icon {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .header-icon {
          color: var(--primary);
        }

        .card-header-icon h3 {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 600;
        }

        .card-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 28px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 16px;
        }

        .settings-fields-group {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .setting-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .setting-label-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }

        .setting-label-col strong {
          font-size: 0.9rem;
          color: #fff;
        }

        .setting-label-col span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .custom-select {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 8px 12px;
          color: var(--text-main);
          outline: none;
          min-width: 140px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .custom-select:focus {
          border-color: var(--primary);
        }

        .custom-select option {
          background-color: #15151e;
          color: #f4f4f5;
        }

        [data-theme="light"] .custom-select {
          background: rgba(0, 0, 0, 0.04);
          border-color: rgba(0, 0, 0, 0.08);
        }

        [data-theme="light"] .custom-select option {
          background-color: #ffffff;
          color: #18181b;
        }

        .setting-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
          margin: 4px 0;
        }

        .toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        /* Toggle switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 42px;
          height: 22px;
          flex-shrink: 0;
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
          height: 16px;
          width: 16px;
          left: 2px;
          bottom: 2px;
          background-color: var(--slider-knob);
          transition: .3s;
        }

        input:checked + .slider {
          background-color: var(--primary);
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

        .sub-panel {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sub-panel h4 {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
        }

        .sub-panel-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sub-icon {
          color: var(--primary);
        }

        .quick-actions-bar {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 4px;
        }

        .quick-actions-bar h5 {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .preview-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .preview-btn {
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: var(--text-muted);
          pointer-events: none;
        }

        /* Color schemes */
        .color-scheme-selector {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
        }

        .color-scheme-selector strong {
          font-size: 0.9rem;
          color: #fff;
        }

        .caption-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .color-circles-grid {
          display: flex;
          gap: 16px;
          margin-top: 12px;
          margin-bottom: 8px;
        }

        .color-circle-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid transparent;
          transition: all 0.2s ease;
          position: relative;
        }

        .color-circle-btn:hover {
          transform: scale(1.1);
        }

        .color-circle-btn.selected {
          border-color: #fff;
          box-shadow: 0 0 10px rgba(255,255,255,0.2);
        }

        .check-icon {
          color: #fff;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
        }

        .active-scheme-label {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 500;
        }

        .gap-top {
          margin-top: 8px;
        }

        @media (max-width: 900px) {
          .customizer-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
