'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Zap, Flame, Award, Heart, BookOpen, DollarSign, Smile, Brain } from 'lucide-react';

export const InsightsSection: React.FC = () => {
  const { toggles } = useApp();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Dynamic statistics
  const activeCount = Object.values(toggles).filter(Boolean).length;
  const totalConversations = 314 + (activeCount * 5); // Slightly dynamic based on toggles
  const activePercentText = `${activeCount}/4`;

  // Weekly Conversations Data
  const weeklyData = [
    { day: 'Mon', count: 32 },
    { day: 'Tue', count: 48 },
    { day: 'Wed', count: 42 },
    { day: 'Thu', count: 58 },
    { day: 'Fri', count: 64 },
    { day: 'Sat', count: 38 },
    { day: 'Sun', count: 45 }
  ];

  const maxVal = Math.max(...weeklyData.map(d => d.count));
  const chartHeight = 160;

  // Donut Chart Data
  const donutData = [
    { id: 'iris', name: 'Iris', value: 33.56, color: '#8b5cf6', icon: BookOpen },
    { id: 'medico', name: 'Medico', value: 30.20, color: '#10b981', icon: Heart },
    { id: 'vibe', name: 'Vibe', value: 22.82, color: '#f59e0b', icon: Smile },
    { id: 'vault', name: 'Vault', value: 13.42, color: '#3b82f6', icon: DollarSign }
  ];

  // Donut SVG parameters
  const size = 180;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="insights-container animate-slide-in">
      <div className="insights-grid-layout">
        {/* Left Column: Stats & Charts */}
        <div className="insights-left-col">
          <div className="section-header">
            <h3>Your Insights</h3>
            <p>A quick glance at how your AIs are helping you this week.</p>
          </div>

          {/* Cards Grid */}
          <div className="metrics-cards-grid">
            <div className="metric-card glass">
              <div className="card-top">
                <Activity size={20} className="icon-pink" />
                <span className="card-percent">+20%</span>
              </div>
              <span className="card-val">{totalConversations}</span>
              <span className="card-title">Total Conversations</span>
            </div>

            <div className="metric-card glass">
              <div className="card-top">
                <Zap size={20} className="icon-purple" />
                <span className="card-badge">Sync</span>
              </div>
              <span className="card-val">{activePercentText}</span>
              <span className="card-title">Active Models</span>
            </div>

            <div className="metric-card glass">
              <div className="card-top">
                <Award size={20} className="icon-blue" />
                <span className="card-badge">Avg</span>
              </div>
              <span className="card-val">{Math.round(totalConversations / 7)}</span>
              <span className="card-title">Chats Per Day</span>
            </div>

            <div className="metric-card glass">
              <div className="card-top">
                <Flame size={20} className="icon-orange" />
                <span className="card-percent">Streaks</span>
              </div>
              <span className="card-val">7 🔥</span>
              <span className="card-title">Engagement Days</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-flex-row">
            {/* Weekly Usage SVG Bar Chart */}
            <div className="chart-wrapper glass">
              <h4>Weekly Usage</h4>
              <div className="svg-container">
                <svg width="100%" height={chartHeight} viewBox={`0 0 320 ${chartHeight}`} preserveAspectRatio="none">
                  {weeklyData.map((d, index) => {
                    const barWidth = 24;
                    const spacing = 42;
                    const x = index * spacing + 20;
                    const ratio = d.count / maxVal;
                    const height = ratio * (chartHeight - 40);
                    const y = chartHeight - height - 25;
                    const isHovered = hoveredBar === index;

                    return (
                      <g 
                        key={index}
                        onMouseEnter={() => setHoveredBar(index)}
                        onMouseLeave={() => setHoveredBar(null)}
                        className="bar-group"
                      >
                        {/* Shadow Hover Background */}
                        <rect
                          x={x - 6}
                          y={10}
                          width={barWidth + 12}
                          height={chartHeight - 35}
                          fill={isHovered ? 'rgba(255, 255, 255, 0.03)' : 'transparent'}
                          rx={8}
                        />
                        {/* Bar Gradient fill */}
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={height}
                          fill={isHovered ? 'var(--primary)' : 'rgba(var(--primary-rgb), 0.65)'}
                          rx={6}
                          className="bar-rect"
                        />
                        {/* Value Tooltip */}
                        {isHovered && (
                          <text
                            x={x + barWidth / 2}
                            y={y - 8}
                            textAnchor="middle"
                            fill="#fff"
                            fontSize="10"
                            fontWeight="700"
                          >
                            {d.count}
                          </text>
                        )}
                        {/* Day label */}
                        <text
                          x={x + barWidth / 2}
                          y={chartHeight - 8}
                          textAnchor="middle"
                          fill={isHovered ? '#fff' : 'var(--text-muted)'}
                          fontSize="11"
                          fontWeight={isHovered ? '600' : '400'}
                        >
                          {d.day}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Model Distribution Donut Chart */}
            <div className="chart-wrapper glass">
              <h4>Usage Distribution</h4>
              <div className="donut-flex">
                <div className="donut-chart-container">
                  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="transparent"
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth="16"
                    />
                    {donutData.map((slice) => {
                      const strokeDash = (slice.value / 100) * circumference;
                      const strokeOffset = circumference - (accumulatedPercent / 100) * circumference;
                      accumulatedPercent += slice.value;
                      const isHovered = hoveredSlice === slice.id;

                      return (
                        <circle
                          key={slice.id}
                          cx={size / 2}
                          cy={size / 2}
                          r={radius}
                          fill="transparent"
                          stroke={slice.color}
                          strokeWidth={isHovered ? '20' : '16'}
                          strokeDasharray={`${strokeDash} ${circumference}`}
                          strokeDashoffset={strokeOffset}
                          transform={`rotate(-90 ${size / 2} ${size / 2})`}
                          onMouseEnter={() => setHoveredSlice(slice.id)}
                          onMouseLeave={() => setHoveredSlice(null)}
                          className="donut-slice"
                        />
                      );
                    })}
                  </svg>
                  <div className="donut-center-text">
                    <span className="donut-center-val">{hoveredSlice ? `${donutData.find(d=>d.id===hoveredSlice)?.value}%` : 'Models'}</span>
                    <span className="donut-center-lbl">{hoveredSlice ? donutData.find(d=>d.id===hoveredSlice)?.name : 'Active'}</span>
                  </div>
                </div>

                <div className="donut-legend">
                  {donutData.map(slice => (
                    <div 
                      key={slice.id}
                      className={`legend-item ${hoveredSlice === slice.id ? 'active' : ''}`}
                      onMouseEnter={() => setHoveredSlice(slice.id)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    >
                      <div className="legend-dot" style={{ backgroundColor: slice.color }}></div>
                      <span>{slice.name}</span>
                      <strong className="legend-val">{slice.value}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Brain Network Hub */}
        <div className="insights-right-col">
          <div className="section-header">
            <h3>Your Personal AI</h3>
            <p>The central controller of your dashboard workspace.</p>
          </div>

          <div className="brain-hub-card glass">
            {/* Visual SVG Network Diagram */}
            <div className="brain-network-visual">
              <svg width="100%" height="280" viewBox="0 0 320 280">
                {/* Connection lines from center (160, 140) to outer agents */}
                {/* Iris: (70, 70) */}
                {/* Medico: (250, 70) */}
                {/* Vibe: (70, 210) */}
                {/* Vault: (250, 210) */}
                {
                  [
                    { id: 'iris', name: 'Iris', tx: 60, ty: 70, val: '45%', color: '#8b5cf6', active: toggles.iris },
                    { id: 'medico', name: 'Medico', tx: 260, ty: 70, val: '25%', color: '#10b981', active: toggles.medico },
                    { id: 'vibe', name: 'Vibe', tx: 60, ty: 210, val: '15%', color: '#f59e0b', active: toggles.vibe },
                    { id: 'vault', name: 'Vault', tx: 260, ty: 210, val: '15%', color: '#3b82f6', active: toggles.vault }
                  ].map((node) => {
                    const cx = 160;
                    const cy = 140;
                    
                    return (
                      <g key={node.id}>
                        {/* Connecting Path Line */}
                        <line
                          x1={cx}
                          y1={cy}
                          x2={node.tx}
                          y2={node.ty}
                          stroke={node.active ? node.color : 'rgba(255,255,255,0.06)'}
                          strokeWidth={node.active ? '2.5' : '1'}
                          strokeDasharray={node.active ? '5,5' : 'none'}
                          className={node.active ? 'animated-path' : ''}
                        />

                        {/* Particle indicator */}
                        {node.active && (
                          <circle r="4" fill={node.color}>
                            <animateMotion 
                              dur="3s" 
                              repeatCount="indefinite" 
                              path={`M ${cx} ${cy} L ${node.tx} ${node.ty}`}
                            />
                          </circle>
                        )}

                        {/* Midpoint Label Bubble */}
                        <g transform={`translate(${(cx + node.tx) / 2}, ${(cy + node.ty) / 2})`}>
                          <rect
                            x="-16"
                            y="-10"
                            width="32"
                            height="20"
                            rx="6"
                            fill="#18181b"
                            stroke={node.active ? node.color : 'rgba(255,255,255,0.08)'}
                            strokeWidth="1"
                          />
                          <text
                            textAnchor="middle"
                            y="4"
                            fill={node.active ? '#fff' : 'var(--text-muted)'}
                            fontSize="10"
                            fontWeight="600"
                          >
                            {node.val}
                          </text>
                        </g>

                        {/* Agent Outer Node */}
                        <g transform={`translate(${node.tx}, ${node.ty})`}>
                          <circle
                            r="24"
                            fill="rgba(15,15,20,0.9)"
                            stroke={node.active ? node.color : 'rgba(255,255,255,0.05)'}
                            strokeWidth="2"
                          />
                          <circle
                            r="28"
                            fill="transparent"
                            stroke={node.active ? node.color : 'transparent'}
                            strokeWidth="1.5"
                            strokeDasharray="4,4"
                            className="rotating-ring"
                          />
                          {node.id === 'iris' && <BookOpen size={16} style={{ color: node.active ? node.color : 'var(--text-muted)' }} x="-8" y="-8" />}
                          {node.id === 'medico' && <Heart size={16} style={{ color: node.active ? node.color : 'var(--text-muted)' }} x="-8" y="-8" />}
                          {node.id === 'vibe' && <Smile size={16} style={{ color: node.active ? node.color : 'var(--text-muted)' }} x="-8" y="-8" />}
                          {node.id === 'vault' && <DollarSign size={16} style={{ color: node.active ? node.color : 'var(--text-muted)' }} x="-8" y="-8" />}
                          <text
                            y="36"
                            textAnchor="middle"
                            fill={node.active ? '#fff' : 'var(--text-muted)'}
                            fontSize="11"
                            fontWeight="600"
                          >
                            {node.name}
                          </text>
                        </g>
                      </g>
                    );
                  })
                }

                {/* Central Brain Node */}
                <g transform="translate(160, 140)">
                  <circle
                    r="34"
                    fill="url(#brainGlow)"
                    stroke="var(--primary)"
                    strokeWidth="3"
                    className="center-brain-node"
                  />
                  <Brain size={26} style={{ color: '#fff' }} x="-13" y="-13" />
                  
                  {/* Gradients */}
                  <defs>
                    <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.3" />
                    </radialGradient>
                  </defs>
                </g>
              </svg>
            </div>

            {/* Description */}
            <div className="brain-summary-caption">
              <p>
                Your Personal AI managed <strong>{totalConversations}</strong> conversations this week, optimized flow by <strong>20%</strong>, and kept <strong>{activePercentText}</strong> models active seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .insights-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .insights-grid-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 24px;
        }

        .section-header {
          margin-bottom: 16px;
        }

        .section-header h3 {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .section-header p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* Metric indicators */
        .metrics-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .metric-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .icon-pink { color: var(--primary); }
        .icon-purple { color: #8b5cf6; }
        .icon-blue { color: #3b82f6; }
        .icon-orange { color: #f59e0b; }

        .card-percent {
          font-size: 0.7rem;
          font-weight: 700;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .card-badge {
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .card-val {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: var(--font-display);
          color: #fff;
        }

        .card-title {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Chart grids */
        .charts-flex-row {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 20px;
        }

        .chart-wrapper {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chart-wrapper h4 {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 600;
        }

        .svg-container {
          height: 100%;
          display: flex;
          align-items: flex-end;
        }

        .bar-group {
          cursor: pointer;
        }

        .bar-rect {
          transition: all 0.3s ease;
        }

        .donut-flex {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .donut-chart-container {
          position: relative;
          width: 140px;
          height: 140px;
          flex-shrink: 0;
        }

        .donut-chart-container svg {
          width: 100%;
          height: 100%;
        }

        .donut-slice {
          transition: stroke-width 0.2s ease, stroke 0.2s ease;
          cursor: pointer;
        }

        .donut-center-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .donut-center-val {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
        }

        .donut-center-lbl {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .donut-legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background 0.2s ease;
          cursor: pointer;
        }

        .legend-item:hover, .legend-item.active {
          background: rgba(255, 255, 255, 0.04);
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-item span {
          color: var(--text-muted);
          flex-grow: 1;
        }

        .legend-val {
          color: #fff;
        }

        /* Brain Network Hub */
        .brain-hub-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .brain-network-visual {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .center-brain-node {
          animation: brainPulse 3s infinite ease-in-out;
        }

        .animated-path {
          stroke-dasharray: 6, 6;
          animation: particleFlow 2s linear infinite;
        }

        .rotating-ring {
          transform-origin: center;
          animation: rotateRing 8s linear infinite;
        }

        @keyframes rotateRing {
          to { transform: rotate(360deg); }
        }

        .brain-summary-caption {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 16px;
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .brain-summary-caption strong {
          color: #fff;
        }

        @media (max-width: 992px) {
          .insights-grid-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .metrics-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .charts-flex-row {
            grid-template-columns: 1fr;
          }
          .donut-flex {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};
