'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp, AgentType, ChatMessage } from '../context/AppContext';
import { Settings as Gear, Send, Ban, Sliders, Heart, BookOpen, DollarSign, Smile, Brain, Sparkles, Volume2, VolumeX, Save, FileText } from 'lucide-react';

export const ChatSection: React.FC = () => {
  const { 
    activeChatAgent, 
    chatHistories, 
    addMessage, 
    clearChat 
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autonomy, setAutonomy] = useState(0.7); // 0.2 to 1.0 (Creativity)
  const [showAutonomySlider, setShowAutonomySlider] = useState(false);
  
  // Custom Settings States
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const [maxTokens, setMaxTokens] = useState(800);
  const [customPrompt, setCustomPrompt] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getAgentConfig = (agent: AgentType) => {
    switch (agent) {
      case 'medico':
        return { 
          name: 'Medico', 
          role: 'Health Companion', 
          icon: Heart, 
          color: '#10b981', 
          placeholder: 'Ask about nutrition, workout ideas, sleep advice...',
          defaultPrompt: 'You are Medico, the specialized health AI agent. You act as a personal fitness heartbeat and health guide. Provide helpful recommendations on nutrition, workouts, sleep hygiene, and physical balance. Always include a light disclaimer that you are an AI assistant and not a medical doctor. Keep your tone encouraging, direct, and structured.'
        };
      case 'iris':
        return { 
          name: 'Iris', 
          role: 'Work & Study Mentor', 
          icon: BookOpen, 
          color: '#8b5cf6', 
          placeholder: 'Ask for research feedback, summary guides, learning roadmaps...',
          defaultPrompt: 'You are Iris, the specialized work and study mentor AI. You guide the user with academic research support, coding queries, study roadmaps, career options, and focus strategies. Be highly analytical, structured, and insightful. Use bullet points or numbered lists to organize complex topics.'
        };
      case 'vault':
        return { 
          name: 'Vault', 
          role: 'Finance Guard', 
          icon: DollarSign, 
          color: '#3b82f6', 
          placeholder: 'Ask about budget formulas, saving plans, financial terms...',
          defaultPrompt: 'You are Vault, the specialized finance guard AI. You help user calculate budgets, plan savings goals, understand financial terms, and establish risk security protocols. Focus heavily on security, cost-efficiency, and sound savings strategies. Provide financial calculations where helpful, and add a brief disclaimer that you provide educational guidance, not direct financial trading suggestions.'
        };
      case 'vibe':
        return { 
          name: 'Vibe', 
          role: 'Lifestyle Guide', 
          icon: Smile, 
          color: '#f59e0b', 
          placeholder: 'Ask about daily flow, balance habits, meditation guides...',
          defaultPrompt: 'You are Vibe, the specialized lifestyle, mood, and daily balance partner. Speak in a warm, relaxed, motivating, and mindful tone. Help the user build positive habits, suggest meditation exercises, work-life boundaries, screen-free breaks, and mood boosters.'
        };
      default:
        return { 
          name: 'NOVA', 
          role: 'Central AI Brain', 
          icon: Brain, 
          color: 'var(--primary)', 
          placeholder: 'Ask NOVA to route tasks or general questions...',
          defaultPrompt: 'You are NOVA, the central AI assistant of a personalized digital doppelgänger dashboard. You act as the user\'s primary AI companion, helping coordinate daily tasks and general questions. Keep your responses concise, modern, and friendly. Act as the central brain. You can recommend activating specialized agents: Medico (health), Iris (work/study), Vault (finance), or Vibe (lifestyle) when user questions align with those fields.'
        };
    }
  };

  const agentConfig = getAgentConfig(activeChatAgent);
  const activeHistory = chatHistories[activeChatAgent] || [];

  const suggestedPrompts = [
    { text: 'Wanderlust Destinations 2026', sub: 'Must-visit travel guide recommendations' },
    { text: 'NOVA Link Architecture', sub: 'What sets the Doppelgänger system apart' },
    { text: 'Design Trends on Instagram 2026', sub: 'Visual design movements trending now' }
  ];

  // Initialize custom prompt editor when active agent changes
  useEffect(() => {
    setCustomPrompt(agentConfig.defaultPrompt);
  }, [activeChatAgent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeHistory, isLoading]);

  // Speech Synthesis (Text to Speech) implementation
  const speakText = (text: string) => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;

    // Cancel current speech
    synth.cancel();

    // Remove markdown symbols for clear text reading
    const cleanedText = text.replace(/[*#_\[\]()\-`]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = 1.0;
    
    // Customize voices based on agent personalities
    if (activeChatAgent === 'medico') {
      utterance.pitch = 0.95;
    } else if (activeChatAgent === 'vibe') {
      utterance.pitch = 1.1;
      utterance.rate = 0.92;
    } else if (activeChatAgent === 'iris') {
      utterance.pitch = 1.05;
      utterance.rate = 1.05;
    } else if (activeChatAgent === 'vault') {
      utterance.pitch = 0.85;
      utterance.rate = 1.0;
    } else {
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
    }

    synth.speak(utterance);
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Add user message
    addMessage(activeChatAgent, 'user', textToSend);
    setInputText('');
    setIsLoading(true);

    try {
      // Connect to Next.js API endpoint with settings payload
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          agent: activeChatAgent,
          autonomy: autonomy,
          customPrompt: customPrompt !== agentConfig.defaultPrompt ? customPrompt : undefined,
          maxTokens: maxTokens,
          history: activeHistory.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }))
        }),
      });

      if (!response.ok) {
        throw new Error('API failed');
      }

      const data = await response.json();
      addMessage(activeChatAgent, 'ai', data.reply);
      
      // Call Speech synthesis if enabled
      if (readAloud) {
        speakText(data.reply);
      }
    } catch (error) {
      console.warn('Fallback to local mock generator due to API error:', error);
      
      setTimeout(() => {
        let mockReply = '';
        if (activeChatAgent === 'medico') {
          mockReply = `As your health AI, I suggest taking a balanced view on "${textToSend}". Focus on eating complete foods, scheduling 7-8 hours of sleep, and maintaining moderate movement. To fully sync with Gemini, configure your API key in .env.local!`;
        } else if (activeChatAgent === 'iris') {
          mockReply = `Let's break down "${textToSend}" systematically. I recommend outlining the concepts, cross-referencing recent documentation, and creating a study roadmap. You can unlock advanced Gemini answers by adding a API Key!`;
        } else if (activeChatAgent === 'vault') {
          mockReply = `Analyzing "${textToSend}" through a financial planning lens. It's smart to review fixed costs, aim to allocate 20% to savings, and minimize high-interest debts. Set your Gemini API key in your server settings to compute precise financial insights.`;
        } else if (activeChatAgent === 'vibe') {
          mockReply = `That sounds interesting! For "${textToSend}", think about how it affects your daily energy levels and workflow balance. Take brief screens-off breaks. Let me know if you want to write a custom routine.`;
        } else {
          mockReply = `Hello! I am NOVA, your Digital Doppelgänger. I've processed your query about "${textToSend}". To run real-time AI responses, configure your GOOGLE_GENAI_API_KEY environment variable. Let's build your dashboard!`;
        }
        addMessage(activeChatAgent, 'ai', mockReply);
        
        // Call Speech synthesis if enabled
        if (readAloud) {
          speakText(mockReply);
        }
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };



  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="chat-section glass">
      {/* Background Watermark */}
      <div className="chat-watermark">ONE AI, MANY VOICES</div>

      {/* Chat Agent Header */}
      <div className="chat-header">
        <div className="agent-info-row">
          <div className="chat-agent-badge" style={{ background: agentConfig.color + '20', borderColor: agentConfig.color + '40' }}>
            <agentConfig.icon size={20} style={{ color: agentConfig.color }} />
          </div>
          <div>
            <h3>{agentConfig.name}</h3>
            <span>{agentConfig.role}</span>
          </div>
        </div>

        <div className="chat-action-controls">
          <button className="control-btn" onClick={() => clearChat(activeChatAgent)}>
            <Ban size={14} />
            <span>Clear Chat</span>
          </button>
          <button className="control-btn" onClick={() => setShowAutonomySlider(!showAutonomySlider)}>
            <Sliders size={14} />
            <span>Autonomy ({Math.round(autonomy * 100)}%)</span>
          </button>
          {readAloud && (
            <button className="control-btn speech-stop-indicator-btn" onClick={handleStopSpeech} title="Mute text to speech voice">
              <VolumeX size={14} />
              <span>Mute Voice</span>
            </button>
          )}
        </div>
      </div>

      {showAutonomySlider && (
        <div className="autonomy-popup glass animate-slide-in">
          <div className="slider-header">
            <span>Adjust AI Autonomy (Temperature)</span>
            <span>{autonomy > 0.7 ? 'Creative' : autonomy < 0.4 ? 'Precise' : 'Balanced'}</span>
          </div>
          <input 
            type="range" 
            min="0.2" 
            max="1.0" 
            step="0.1" 
            value={autonomy}
            onChange={(e) => setAutonomy(parseFloat(e.target.value))}
            className="autonomy-slider"
          />
        </div>
      )}

      {/* Chat Messages */}
      <div className="chat-body">
        {activeHistory.length === 0 ? (
          <div className="empty-chat-state">
            <Brain size={48} className="empty-brain-icon" />
            <h3>Hi, I am {agentConfig.name}</h3>
            <p>How can I help you today? Select a template below or type your message.</p>
          </div>
        ) : (
          <div className="messages-list">
            {activeHistory.map((msg) => (
              <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                <div className="bubble-wrapper">
                  <div className="bubble-sender-icon">
                    {msg.sender === 'user' ? (
                      <span className="user-initial">U</span>
                    ) : (
                      <agentConfig.icon size={14} style={{ color: agentConfig.color }} />
                    )}
                  </div>
                  <div className="bubble-content-box">
                    <div 
                      className="bubble-content-text"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                    />
                    <span className="bubble-timestamp">{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message-bubble ai loading">
                <div className="bubble-wrapper">
                  <div className="bubble-sender-icon pulse">
                    <agentConfig.icon size={14} style={{ color: agentConfig.color }} />
                  </div>
                  <div className="bubble-content-box">
                    <div className="thinking-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Suggested Prompts - visible when history is short */}
      {activeHistory.length <= 2 && (
        <div className="suggested-prompts-container">
          {suggestedPrompts.map((prompt, idx) => (
            <div 
              key={idx} 
              className="prompt-card glass"
              onClick={() => handleSend(prompt.text)}
            >
              <div className="prompt-card-icon">
                <Sparkles size={14} style={{ color: agentConfig.color }} />
              </div>
              <div className="prompt-card-text">
                <strong>{prompt.text}</strong>
                <span>{prompt.sub}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Footer Input */}
      <div className="chat-footer">
        <button 
          className="footer-action-btn" 
          onClick={() => setShowSettingsModal(true)}
          title="Chat Settings"
        >
          <Gear size={18} />
        </button>

        <div className="input-box-wrapper">
          <input
            type="text"
            placeholder={agentConfig.placeholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
            className="chat-input-field"
          />
          <button 
            className="send-btn"
            onClick={() => handleSend(inputText)}
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Chat Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="chat-settings-modal glass animate-slide-in">
            <div className="modal-title-row">
              <div className="flex-row-center-gap">
                <Gear size={18} style={{ color: agentConfig.color }} />
                <h3>Chat Session Configuration</h3>
              </div>
              <button className="close-x-btn" onClick={() => setShowSettingsModal(false)}>×</button>
            </div>
            <p className="modal-sub">Configure local AI parameters for the {agentConfig.name} workspace.</p>

            <div className="modal-settings-fields">
              {/* Text to Speech Toggle */}
              <div className="setting-field-row">
                <div className="field-label-meta">
                  <strong>Text-to-Speech (Read Aloud)</strong>
                  <span>Synthesize and read the agent replies aloud using browser audio.</span>
                </div>
                <button 
                  className={`voice-toggle-btn ${readAloud ? 'active' : ''}`}
                  onClick={() => setReadAloud(!readAloud)}
                >
                  {readAloud ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  <span>{readAloud ? 'Read Aloud On' : 'Muted'}</span>
                </button>
              </div>

              {/* Max Tokens Slider */}
              <div className="setting-field-row flex-column">
                <div className="slider-label-row">
                  <strong>Maximum Output Length</strong>
                  <span>{maxTokens} tokens (~{Math.round(maxTokens * 0.75)} words)</span>
                </div>
                <input 
                  type="range" 
                  min="200" 
                  max="2000" 
                  step="50"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="tokens-slider"
                />
              </div>

              {/* Custom System Instruction Override */}
              <div className="setting-field-row flex-column">
                <div className="prompt-editor-header">
                  <FileText size={14} style={{ color: agentConfig.color }} />
                  <strong>Custom System Instructions Override</strong>
                </div>
                <span className="caption-info">Rewrite instructions to customize this agent\'s behavior and constraints.</span>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="prompt-override-textarea"
                  rows={5}
                />
                {customPrompt !== agentConfig.defaultPrompt && (
                  <button 
                    className="reset-prompt-btn" 
                    onClick={() => setCustomPrompt(agentConfig.defaultPrompt)}
                  >
                    Reset to Default Instructions
                  </button>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="save-settings-btn"
                style={{ backgroundColor: agentConfig.color }}
                onClick={() => {
                  setShowSettingsModal(false);
                  if (readAloud) {
                    speakText(`Linked to ${agentConfig.name}! Read aloud enabled.`);
                  }
                }}
              >
                <Save size={14} />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-section {
          height: 680px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          background: rgba(15, 15, 20, 0.7);
          border-color: rgba(255, 255, 255, 0.05);
        }

        .chat-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-display);
          font-size: 4rem;
          font-weight: 800;
          letter-spacing: 4px;
          color: rgba(255, 255, 255, 0.015);
          pointer-events: none;
          white-space: nowrap;
          z-index: 0;
          text-transform: uppercase;
        }

        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .agent-info-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-agent-badge {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
        }

        .agent-info-row h3 {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 600;
        }

        .agent-info-row span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .chat-action-controls {
          display: flex;
          gap: 8px;
        }

        .control-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .control-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .speech-stop-indicator-btn {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .speech-stop-indicator-btn:hover {
          background: rgba(239, 68, 68, 0.18);
          color: #fff;
        }

        .autonomy-popup {
          position: absolute;
          top: 70px;
          right: 24px;
          width: 260px;
          padding: 16px;
          background: rgba(15, 15, 20, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          z-index: 20;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }

        .slider-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          margin-bottom: 8px;
        }

        .autonomy-slider {
          width: 100%;
          accent-color: var(--primary);
        }

        /* Chat Body */
        .chat-body {
          flex-grow: 1;
          padding: 24px;
          overflow-y: auto;
          z-index: 1;
        }

        .empty-chat-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: var(--text-muted);
          gap: 12px;
        }

        .empty-brain-icon {
          color: rgba(var(--primary-rgb), 0.2);
          animation: float 4s infinite ease-in-out;
        }

        .empty-chat-state h3 {
          font-family: var(--font-display);
          color: #fff;
          font-size: 1.25rem;
        }

        .empty-chat-state p {
          font-size: 0.85rem;
          max-width: 320px;
          line-height: 1.5;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .message-bubble {
          display: flex;
          max-width: 80%;
        }

        .message-bubble.user {
          margin-left: auto;
          flex-direction: row-reverse;
        }

        .bubble-wrapper {
          display: flex;
          gap: 12px;
        }

        .message-bubble.user .bubble-wrapper {
          flex-direction: row-reverse;
        }

        .bubble-sender-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .bubble-sender-icon.pulse {
          animation: brainPulse 1.5s infinite ease-in-out;
        }

        .user-initial {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
        }

        .bubble-content-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .bubble-content-text {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 0.875rem;
          line-height: 1.5;
          word-break: break-word;
        }

        .message-bubble.ai .bubble-content-text {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #e4e4e7;
          border-top-left-radius: 2px;
        }

        .message-bubble.user .bubble-content-text {
          background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--secondary-rgb), 0.1) 100%);
          border: 1px solid rgba(var(--primary-rgb), 0.25);
          color: #fff;
          border-top-right-radius: 2px;
        }

        .bubble-timestamp {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 2px;
          align-self: flex-start;
        }

        .message-bubble.user .bubble-timestamp {
          align-self: flex-end;
        }

        /* Thinking indicator */
        .thinking-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          width: fit-content;
        }

        .thinking-indicator span {
          width: 6px;
          height: 6px;
          background-color: var(--text-muted);
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .thinking-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .thinking-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }

        /* Suggested Prompts */
        .suggested-prompts-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 0 24px 16px 24px;
          z-index: 5;
        }

        .prompt-card {
          padding: 12px;
          display: flex;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.04);
        }

        .prompt-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--primary);
          transform: translateY(-2px);
        }

        .prompt-card-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .prompt-card-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }

        .prompt-card-text strong {
          font-size: 0.8rem;
          color: #fff;
        }

        .prompt-card-text span {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        /* Chat Footer */
        .chat-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(0, 0, 0, 0.15);
          z-index: 10;
        }

        .footer-action-btn {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.2s ease;
          position: relative;
        }

        .footer-action-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.12);
        }



        .input-box-wrapper {
          flex-grow: 1;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 4px 6px 4px 16px;
          gap: 10px;
          transition: border-color 0.2s ease;
        }

        .input-box-wrapper:focus-within {
          border-color: var(--primary);
        }

        .chat-input-field {
          background: none;
          border: none;
          outline: none;
          width: 100%;
          color: #fff;
          font-size: 0.875rem;
          height: 34px;
        }

        .send-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: var(--primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          filter: brightness(1.15);
        }

        .send-btn:disabled {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          cursor: not-allowed;
        }

        /* Settings Modal & Overlays */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 500;
        }

        .flex-row-center-gap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .close-x-btn {
          font-size: 1.5rem;
          color: var(--text-muted);
          font-weight: 300;
        }

        .close-x-btn:hover {
          color: #fff;
        }

        .modal-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .modal-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 20px;
          text-align: left;
        }

        .chat-settings-modal {
          width: 480px;
          padding: 28px;
          background: rgba(15, 15, 20, 0.96);
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }

        .modal-settings-fields {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 24px;
        }

        .setting-field-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .setting-field-row.flex-column {
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
          text-align: left;
        }

        .field-label-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }

        .field-label-meta strong {
          font-size: 0.9rem;
          color: #fff;
        }

        .field-label-meta span {
          font-size: 0.725rem;
          color: var(--text-muted);
          line-height: 1.3;
        }

        .voice-toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .voice-toggle-btn:hover {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.15);
        }

        .voice-toggle-btn.active {
          color: #fff;
          background: rgba(var(--primary-rgb), 0.15);
          border-color: var(--primary);
        }

        .slider-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .slider-label-row strong {
          color: #fff;
        }

        .slider-label-row span {
          color: var(--primary);
          font-weight: 600;
        }

        .tokens-slider {
          width: 100%;
          accent-color: var(--primary);
        }

        .prompt-editor-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #fff;
        }

        .caption-info {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .prompt-override-textarea {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 10px;
          color: #e4e4e7;
          outline: none;
          font-size: 0.8rem;
          line-height: 1.4;
          resize: none;
        }

        .prompt-override-textarea:focus {
          border-color: var(--primary);
        }

        .reset-prompt-btn {
          align-self: flex-start;
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 500;
        }

        .save-settings-btn {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.25);
          transition: filter 0.2s ease;
        }

        .save-settings-btn:hover {
          filter: brightness(1.1);
        }

        @media (max-width: 768px) {
          .suggested-prompts-container {
            grid-template-columns: 1fr;
            padding: 0 16px 8px 16px;
          }
          .chat-section {
            height: 580px;
          }
          .chat-settings-modal {
            width: 90%;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

const parseMarkdownTable = (rows: string[]) => {
  let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.15); border-radius: 8px; overflow: hidden;">';
  
  // Header row
  const headerCols = rows[0].split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
  tableHtml += '<thead style="background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.08);"><tr>';
  headerCols.forEach(col => {
    tableHtml += `<th style="padding: 10px 14px; text-align: left; font-weight: 600; color: #fff;">${col}</th>`;
  });
  tableHtml += '</tr></thead><tbody>';

  // Body rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].trim();
    if (row.includes('---')) continue;
    
    const cols = row.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
    tableHtml += '<tr style="border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.2s;">';
    cols.forEach(col => {
      tableHtml += `<td style="padding: 10px 14px; color: var(--text-main);">${col}</td>`;
    });
    tableHtml += '</tr>';
  }

  tableHtml += '</tbody></table>';
  return tableHtml;
};

const renderMarkdown = (text: string) => {
  if (!text) return '';

  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks: ```js ... ``` -> <pre><code>...</code></pre>
  html = html.replace(/```([\s\S]*?)```/g, (match, p1) => {
    const cleanCode = p1.replace(/^[a-zA-Z0-9+#-]+\n/, '');
    return `<pre style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; font-family: monospace; overflow-x: auto; margin: 8px 0; border: 1px solid rgba(255,255,255,0.06); font-size: 0.85rem;"><code>${cleanCode}</code></pre>`;
  });

  // Inline code: `code` -> <code>code</code>
  html = html.replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>');

  // Bold text: **text** -> <strong>text</strong>
  html = html.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h4 style="font-family: var(--font-display); color: #fff; font-weight: 600; margin: 12px 0 6px 0; font-size: 1rem;">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 style="font-family: var(--font-display); color: #fff; font-weight: 600; margin: 16px 0 8px 0; font-size: 1.15rem;">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 style="font-family: var(--font-display); color: #fff; font-weight: 700; margin: 20px 0 10px 0; font-size: 1.3rem;">$1</h2>');

  // Tables parsing
  const lines = html.split('\n');
  let inTable = false;
  let tableRows: string[] = [];
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(line);
    } else {
      if (inTable) {
        const tableHtml = parseMarkdownTable(tableRows);
        processedLines.push(tableHtml);
        inTable = false;
      }
      processedLines.push(lines[i]);
    }
  }
  if (inTable) {
    const tableHtml = parseMarkdownTable(tableRows);
    processedLines.push(tableHtml);
  }
  html = processedLines.join('\n');

  // Bullet points
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 4px; list-style-type: disc;">$1</li>');
  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 4px; list-style-type: decimal;">$1</li>');

  // Restore line breaks
  html = html.replace(/&lt;br&gt;/g, '<br />');

  // Convert newlines to br unless part of block structures
  html = html.split('\n').map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('<h') || trimmed.startsWith('<pre') || trimmed.startsWith('<code') || trimmed.startsWith('<table') || trimmed.startsWith('<tr') || trimmed.startsWith('<td') || trimmed.startsWith('<th') || trimmed.startsWith('<li') || trimmed.startsWith('</li') || trimmed.startsWith('</ul') || trimmed.startsWith('</ol') || trimmed.startsWith('</table')) {
      return line;
    }
    return line + '<br />';
  }).join('\n');

  return html;
};
