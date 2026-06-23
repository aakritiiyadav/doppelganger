'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp, Account } from '../context/AppContext';
import { Shield, Sparkles, User, Key, Trash2, Mail, Phone, Calendar, Briefcase, Plus, Image, Check, Users, Sparkle } from 'lucide-react';

export const ProfileSection: React.FC = () => {
  const { 
    accounts,
    activeAccountId,
    activeAccount, 
    updateActiveAccount, 
    profileCompletion, 
    setCurrentPage, 
    setActiveChatAgent,
    createAccount
  } = useApp();
  
  // Local edit states
  const [email, setEmail] = useState(activeAccount.email);
  const [mobile, setMobile] = useState(activeAccount.mobile);
  const [dob, setDob] = useState(activeAccount.dob);
  const [role, setRole] = useState(activeAccount.role);
  const [name, setName] = useState(activeAccount.name);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Sign up form states
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpRole, setSignUpRole] = useState('');
  const [signUpAvatar, setSignUpAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');

  const [isHighlightingDetails, setIsHighlightingDetails] = useState(false);
  const detailsCardRef = useRef<HTMLDivElement>(null);

  // Image Generator states
  const [showImageGenModal, setShowImageGenModal] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState('');
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(null);

  // Predefined avatar selections
  const presetAvatars = [
    { name: 'Default Software Engineer', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
    { name: 'AI Research Specialist', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
    { name: 'Tech Explorer Female', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    { name: 'Cybernetic Brain Glow', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80' },
    { name: 'Abstract Nebula Orb', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=150&q=80' },
    { name: 'Minimalist Robot Shield', url: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=150&q=80' }
  ];

  // Sync edit states when active account changes
  useEffect(() => {
    setEmail(activeAccount.email);
    setMobile(activeAccount.mobile);
    setDob(activeAccount.dob);
    setRole(activeAccount.role);
    setName(activeAccount.name);
    setIsEditing(false);
  }, [activeAccountId, activeAccount]);

  // SVG Circular Gauge variables
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (profileCompletion / 100) * circumference;

  const handleSave = () => {
    updateActiveAccount({
      email,
      mobile,
      dob,
      role,
      name
    });
    setIsEditing(false);
    triggerNotification('Account details updated successfully!');
  };

  const handleCancel = () => {
    setEmail(activeAccount.email);
    setMobile(activeAccount.mobile);
    setDob(activeAccount.dob);
    setRole(activeAccount.role);
    setName(activeAccount.name);
    setIsEditing(false);
  };

  const selectAvatar = (url: string) => {
    updateActiveAccount({ avatar: url });
    setShowAvatarModal(false);
    triggerNotification('Profile picture updated!');
  };

  const handleCustomAvatarSubmit = () => {
    if (customAvatarUrl.trim()) {
      updateActiveAccount({ avatar: customAvatarUrl });
      setShowAvatarModal(false);
      setCustomAvatarUrl('');
      triggerNotification('Custom profile picture applied!');
    }
  };

  const triggerNotification = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => {
      setShowNotification(null);
    }, 3000);
  };

  const handleNewChat = () => {
    setActiveChatAgent('nova');
    setCurrentPage('dashboard');
  };

  // Image Generation Simulation linking to Pollinations.ai free API
  const handleGenerateImage = () => {
    if (!imagePrompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedImgUrl(null);
    
    // Simulate generation steps for high fidelity feel
    setGenStep('Initializing latent diffusion space...');
    
    setTimeout(() => {
      setGenStep('Denoising pixels (iteration 25/50)...');
    }, 1200);

    setTimeout(() => {
      setGenStep('Upscaling resolution & applying color grading...');
    }, 2400);

    setTimeout(() => {
      // Connect to pollinations AI image generation endpoint
      const seed = Math.floor(Math.random() * 100000);
      const url = `https://image.pollinations.ai/p/${encodeURIComponent(imagePrompt)}?width=500&height=500&nologo=true&seed=${seed}`;
      
      setGeneratedImgUrl(url);
      setIsGenerating(false);
      
      // Update account statistics
      updateActiveAccount({
        imagesCount: activeAccount.imagesCount + 1,
        spentRequests: activeAccount.spentRequests + 1,
        remainingRequests: Math.max(0, activeAccount.remainingRequests - 1)
      });
      
      triggerNotification('Image generated successfully!');
    }, 3600);
  };

  const handleSetGeneratedAsAvatar = () => {
    if (generatedImgUrl) {
      updateActiveAccount({ avatar: generatedImgUrl });
      setShowImageGenModal(false);
      setGeneratedImgUrl(null);
      setImagePrompt('');
      triggerNotification('Generated image set as profile avatar!');
    }
  };

  const handleSignUpSubmit = () => {
    if (signUpName.trim() && signUpEmail.trim()) {
      createAccount(signUpName, signUpEmail, signUpRole || 'User Profile', signUpAvatar);
      setSignUpName('');
      setSignUpEmail('');
      setSignUpRole('');
      setShowSignUpModal(false);
      triggerNotification('New account created and loaded!');
    }
  };

  return (
    <div className="profile-container animate-slide-in">
      {showNotification && (
        <div className="profile-alert glass animate-slide-in">
          <Sparkles size={16} className="alert-icon" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Profile Header Main Card */}
      <div className="profile-header-card glass">
        <div className="header-card-layout">
          <div className="avatar-section">
            <div className="avatar-wrapper-hover">
              <img src={activeAccount.avatar} alt="User Avatar" className="large-avatar" />
              <div className="avatar-overlay-click" onClick={() => setShowAvatarModal(true)}>
                <span>Change</span>
              </div>
            </div>
            <button className="change-avatar-btn" onClick={() => setShowAvatarModal(true)}>Change Picture</button>
          </div>

          <div className="header-info-section">
            <div className="name-row">
              {isEditing ? (
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="name-input"
                />
              ) : (
                <h2>{activeAccount.name}</h2>
              )}
            </div>
            <p className="reg-text">Registered At: January 10, 2025  |  Last Login: August 23, 2025</p>
            
            <div className="subscription-flex-row">
              <div className="account-action-buttons">
                <button className="switch-acc-main-btn" onClick={() => setShowSignUpModal(true)}>
                  <Plus size={16} />
                  <span>Sign Up / Create New Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details, Overview, Meter */}
      <div className="profile-details-grid">
        {/* Customer Details Form */}
        <div ref={detailsCardRef} className={`details-card glass ${isHighlightingDetails ? 'highlight-pulse' : ''}`}>
          <div className="card-title-row">
            <h3>Customer Details</h3>
            {!isEditing ? (
              <button className="edit-details-btn" onClick={() => setIsEditing(true)}>Edit Details</button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>Save</button>
                <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
              </div>
            )}
          </div>

          <div className="form-fields">
            <div className="form-field-row">
              <Mail size={16} className="field-icon" />
              <div className="field-inputs">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled={!isEditing}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="form-field-row">
              <Phone size={16} className="field-icon" />
              <div className="field-inputs">
                <label>Mobile Number</label>
                <input
                  type="text"
                  value={mobile}
                  disabled={!isEditing}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            <div className="form-field-row">
              <Calendar size={16} className="field-icon" />
              <div className="field-inputs">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  disabled={!isEditing}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
            </div>

            <div className="form-field-row">
              <Briefcase size={16} className="field-icon" />
              <div className="field-inputs">
                <label>Role / Occupation</label>
                <input
                  type="text"
                  value={role}
                  disabled={!isEditing}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Enter your job role"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="details-card glass flex-column-between">
          <div>
            <h3>Overview Metrics</h3>
            <p className="card-desc-muted">Interaction statistics for the active account.</p>
            
            <div className="stats-list">
              <div className="stat-item-row">
                <span className="stat-label">Topics in Chat</span>
                <span className="stat-value">{activeAccount.topicsCount}</span>
              </div>
              <div className="stat-item-row">
                <span className="stat-label">Generated Images</span>
                <span className="stat-value">{activeAccount.imagesCount}</span>
              </div>
              <div className="stat-item-row">
                <span className="stat-label">API Requests Spent</span>
                <span className="stat-value">{activeAccount.spentRequests.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="overview-actions">
            <button className="action-button-filled" onClick={handleNewChat}>
              <Plus size={16} />
              <span>Start New Chat</span>
            </button>
            <button className="action-button-outline" onClick={() => setShowImageGenModal(true)}>
              <Image size={16} />
              <span>Generate Image</span>
            </button>
          </div>
        </div>

        {/* Profile Completion Meter */}
        <div className="details-card glass flex-column-center">
          <h3>Profile Completion</h3>
          
          <div className="completion-gauge-wrapper">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.04)"
                strokeWidth={strokeWidth}
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke="url(#gaugeGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                className="gauge-circle"
              />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--secondary)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="gauge-text">
              <span className="gauge-percent">{profileCompletion}%</span>
              <span className="gauge-label">Complete</span>
            </div>
          </div>

          <p className="meter-subtitle">
            {profileCompletion === 100 
              ? 'Awesome! Your profile details are fully complete.'
              : 'Add missing details to achieve 100% personalization.'
            }
          </p>

          <button 
            className="complete-now-btn" 
            disabled={profileCompletion === 100}
            onClick={() => {
              setIsEditing(true);
              setIsHighlightingDetails(true);
              setTimeout(() => setIsHighlightingDetails(false), 1200);
              detailsCardRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {profileCompletion === 100 ? 'All Details Saved' : 'Complete Now'}
          </button>
        </div>
      </div>

      {/* Security Cards */}
      <div className="profile-security-row">
        {/* Security / 2FA */}
        <div className="security-card glass">
          <div className="security-header">
            <Shield size={20} className="security-icon" />
            <div className="security-title-meta">
              <h4>Security Settings</h4>
              <span>Enable additional account verification features.</span>
            </div>
          </div>

          <div className="security-setting-row">
            <div className="setting-description">
              <strong>Two-Factor Authentication (2FA)</strong>
              <span>Secure your account using SMS verification codes.</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={activeAccount.twoFactorEnabled}
                onChange={(e) => updateActiveAccount({ twoFactorEnabled: e.target.checked })}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <button className="delete-acc-btn" onClick={() => triggerNotification('Account deletion is locked for demo security.')}>
            <Trash2 size={14} />
            <span>Delete Account</span>
          </button>
        </div>

        {/* Change Password Card */}
        <div className="security-card glass">
          <div className="security-header">
            <Key size={20} className="security-icon" />
            <div className="security-title-meta">
              <h4>Password & Authentication</h4>
              <span>Update login passwords or reset secret tokens.</span>
            </div>
          </div>

          <p className="security-text-muted">
            It is recommended to change your password every 90 days to keep your doppelgänger context protected.
          </p>

          <button className="change-pwd-btn" onClick={() => setShowPasswordModal(true)}>
            Change Account Password
          </button>
        </div>
      </div>

      {/* Preset Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="modal-overlay">
          <div className="avatar-modal-box glass animate-slide-in">
            <div className="modal-title-row">
              <h3>Select Profile Picture</h3>
              <button className="close-x-btn" onClick={() => setShowAvatarModal(false)}>×</button>
            </div>
            <p className="modal-sub">Choose from premium AI presets or paste a custom web URL.</p>

            <div className="avatars-preset-grid">
              {presetAvatars.map((preset, idx) => {
                const isActive = activeAccount.avatar === preset.url;
                return (
                  <div 
                    key={idx} 
                    className={`preset-avatar-card ${isActive ? 'active' : ''}`}
                    onClick={() => selectAvatar(preset.url)}
                    title={preset.name}
                  >
                    <img src={preset.url} alt={preset.name} />
                    {isActive && (
                      <div className="preset-selected-check">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="custom-url-field">
              <label>Custom Image Link URL</label>
              <div className="url-submit-row">
                <input 
                  type="text" 
                  placeholder="https://example.com/avatar.jpg"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                />
                <button className="apply-url-btn" onClick={handleCustomAvatarSubmit}>Apply Link</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time AI Image Generator Modal */}
      {showImageGenModal && (
        <div className="modal-overlay">
          <div className="image-gen-modal-box glass animate-slide-in">
            <div className="modal-title-row">
              <div className="flex-row-center-gap">
                <Sparkle size={18} style={{ color: 'var(--primary)' }} />
                <h3>AI Image Generator Workspace</h3>
              </div>
              <button className="close-x-btn" onClick={() => {
                setShowImageGenModal(false);
                setGeneratedImgUrl(null);
                setImagePrompt('');
              }}>×</button>
            </div>
            <p className="modal-sub">Generate visual artwork using text prompts, powered by latency diffusion modeling.</p>

            <div className="image-gen-layout">
              {/* Left Side Inputs */}
              <div className="image-gen-input-col">
                <div className="prompt-input-group">
                  <label>Describe the Image Prompt</label>
                  <textarea 
                    placeholder="e.g. A cybernetic human brain node showing colorful glowing connections, synthwave neon art style, dark futuristic room"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    disabled={isGenerating}
                    rows={4}
                    className="prompt-textarea"
                  />
                </div>
                <button 
                  className="generate-submit-btn"
                  onClick={handleGenerateImage}
                  disabled={isGenerating || !imagePrompt.trim()}
                >
                  {isGenerating ? 'Generating Artwork...' : 'Generate AI Image'}
                </button>
              </div>

              {/* Right Side Render Preview */}
              <div className="image-gen-preview-col">
                <div className="image-preview-frame">
                  {isGenerating ? (
                    <div className="generation-loader">
                      <div className="loader-ring"></div>
                      <span className="step-txt">{genStep}</span>
                      <div className="progress-bar-container">
                        <div className="progress-fill-loading"></div>
                      </div>
                    </div>
                  ) : generatedImgUrl ? (
                    <img src={generatedImgUrl} alt="Generated AI Artwork" className="rendered-ai-img" />
                  ) : (
                    <div className="empty-preview-placeholder">
                      <Image size={40} className="icon-placeholder-gen" />
                      <span>Ready to Render</span>
                      <p>Visual assets appear here once generation finishes.</p>
                    </div>
                  )}
                </div>

                {generatedImgUrl && (
                  <div className="post-generation-actions">
                    <button className="set-avatar-action-btn" onClick={handleSetGeneratedAsAvatar}>
                      Set as Profile Avatar
                    </button>
                    <a href={generatedImgUrl} target="_blank" rel="noopener noreferrer" className="download-action-btn">
                      Open Full Size
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up / Create Account Modal */}
      {showSignUpModal && (
        <div className="modal-overlay">
          <div className="signup-modal-box glass animate-slide-in">
            <div className="modal-title-row">
              <h3>Sign Up / Create New Account</h3>
              <button className="close-x-btn" onClick={() => setShowSignUpModal(false)}>×</button>
            </div>
            <p className="modal-sub">Create a new local Doppelgänger context profile.</p>

            <div className="modal-fields">
              <div className="modal-input-group">
                <label>Profile Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                />
              </div>

              <div className="modal-input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. john@example.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                />
              </div>

              <div className="modal-input-group">
                <label>Role / Occupation</label>
                <input 
                  type="text" 
                  placeholder="e.g. Product Designer"
                  value={signUpRole}
                  onChange={(e) => setSignUpRole(e.target.value)}
                />
              </div>

              <div className="modal-input-group">
                <label>Select Avatar Preset</label>
                <div className="signup-avatars-presets">
                  {presetAvatars.map((av, idx) => (
                    <img 
                      key={idx}
                      src={av.url}
                      alt={av.name}
                      className={`signup-preset-img ${signUpAvatar === av.url ? 'active' : ''}`}
                      onClick={() => setSignUpAvatar(av.url)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions-signup">
              <button className="modal-btn-filled-signup" onClick={handleSignUpSubmit}>Create Account</button>
              <button className="modal-btn-cancel-signup" onClick={() => setShowSignUpModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="password-modal glass animate-slide-in">
            <h3>Change Password</h3>
            <p>Update your portal access key. Keep it secure.</p>
            
            <div className="modal-fields">
              <div className="modal-input-group">
                <label>Current Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="modal-input-group">
                <label>New Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="modal-input-group">
                <label>Confirm New Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="modal-btn-filled" 
                onClick={() => {
                  setShowPasswordModal(false);
                  triggerNotification('Password updated successfully!');
                }}
              >
                Update Password
              </button>
              <button className="modal-btn-cancel" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .profile-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: relative;
        }

        .profile-alert {
          position: fixed;
          top: 24px;
          right: 24px;
          padding: 12px 24px;
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.4);
          color: #fff;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 200;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .alert-icon {
          color: #10b981;
          animation: float 2s infinite ease-in-out;
        }

        /* Profile Header Card */
        .profile-header-card {
          padding: 28px;
        }

        .header-card-layout {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .avatar-wrapper-hover {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: 20px;
          overflow: hidden;
          border: 3px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
        }

        .large-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-overlay-click {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .avatar-wrapper-hover:hover .avatar-overlay-click {
          opacity: 1;
        }

        .avatar-overlay-click span {
          font-size: 0.75rem;
          font-weight: 600;
          color: #fff;
        }

        .change-avatar-btn {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 500;
        }

        .header-info-section {
          flex-grow: 1;
        }

        .name-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .name-row h2 {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          color: #fff;
        }

        .name-input {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--primary);
          border-radius: 8px;
          padding: 4px 12px;
          font-size: 1.5rem;
          color: #fff;
          font-weight: 700;
          outline: none;
          max-width: 240px;
        }

        .premium-badge {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--primary);
          background: rgba(var(--primary-rgb), 0.1);
          border: 1px solid rgba(var(--primary-rgb), 0.25);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .reg-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .subscription-flex-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .subscription-box {
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.04);
          padding: 12px 18px;
          border-radius: 12px;
          flex-grow: 1;
        }

        .subscription-box p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .subscription-box strong {
          color: #fff;
        }

        .switch-acc-main-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          padding: 10px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.15);
          transition: all 0.2s ease;
        }

        .switch-acc-main-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.1);
        }

        /* 3-Column details layout */
        .profile-details-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.9fr 0.9fr;
          gap: 20px;
        }

        .details-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .flex-column-between {
          justify-content: space-between;
        }

        .flex-column-center {
          align-items: center;
          text-align: center;
        }

        .card-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-title-row h3, .details-card h3 {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
          color: #fff;
        }

        .edit-details-btn {
          font-size: 0.8rem;
          color: var(--primary);
          font-weight: 600;
        }

        .edit-actions {
          display: flex;
          gap: 8px;
        }

        .save-btn {
          font-size: 0.8rem;
          color: #10b981;
          font-weight: 600;
        }

        .cancel-btn {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .card-desc-muted {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-field-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.03);
          padding: 10px 14px;
          border-radius: 10px;
        }

        .field-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        .field-inputs {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .field-inputs label {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        .field-inputs input {
          background: none;
          border: none;
          outline: none;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0;
          width: 100%;
        }

        .field-inputs input:disabled {
          color: #d4d4d8;
        }

        .field-inputs input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
          cursor: pointer;
        }

        /* Overview stats */
        .stats-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }

        .stat-item-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .stat-label {
          font-size: 0.825rem;
          color: var(--text-muted);
        }

        .stat-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
        }

        .overview-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          margin-top: 16px;
        }

        .action-button-filled {
          background: var(--primary);
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .action-button-filled:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .action-button-outline {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: var(--text-main);
          font-size: 0.85rem;
          font-weight: 600;
          padding: 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .action-button-outline:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.12);
        }

        /* SVG Meter */
        .completion-gauge-wrapper {
          position: relative;
          width: 140px;
          height: 140px;
          margin-top: 10px;
        }

        .gauge-circle {
          transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gauge-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .gauge-percent {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }

        .gauge-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .meter-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.4;
          max-width: 200px;
        }

        .complete-now-btn {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          transition: all 0.2s ease;
        }

        .complete-now-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--secondary-rgb), 0.08) 100%);
          border-color: var(--primary);
        }

        .complete-now-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          color: #10b981;
          border-color: rgba(16,185,129,0.2);
        }

        /* Security Cards Row */
        .profile-security-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .security-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .security-header {
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 12px;
        }

        .security-icon {
          color: var(--primary);
        }

        .security-title-meta h4 {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 600;
          color: #fff;
        }

        .security-title-meta span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .security-setting-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          padding: 12px 16px;
          border-radius: 10px;
        }

        .setting-description {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .setting-description strong {
          font-size: 0.85rem;
          color: #fff;
        }

        .setting-description span {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 38px;
          height: 20px;
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
          height: 14px;
          width: 14px;
          left: 2px;
          bottom: 2px;
          background-color: var(--slider-knob);
          transition: .3s;
        }

        input:checked + .slider {
          background-color: #10b981;
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

        .delete-acc-btn {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #ef4444;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 6px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.15);
          transition: all 0.2s ease;
        }

        .delete-acc-btn:hover {
          background: rgba(239, 68, 68, 0.12);
        }

        .security-text-muted {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .change-pwd-btn {
          align-self: flex-start;
          font-size: 0.85rem;
          font-weight: 600;
          color: #fff;
          background: var(--primary);
          padding: 10px 18px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .change-pwd-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        /* Modal Base styling */
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

        /* Avatar Box styling */
        .avatar-modal-box {
          width: 440px;
          padding: 28px;
          background: rgba(15, 15, 20, 0.95);
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }

        .modal-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .modal-title-row h3 {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
          color: #fff;
        }

        .close-x-btn {
          font-size: 1.5rem;
          color: var(--text-muted);
          font-weight: 300;
        }

        .close-x-btn:hover {
          color: #fff;
        }

        .modal-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 20px;
          text-align: left;
        }

        .avatars-preset-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .preset-avatar-card {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.02);
        }

        .preset-avatar-card:hover {
          transform: scale(1.05);
          border-color: rgba(var(--primary-rgb), 0.5);
        }

        .preset-avatar-card.active {
          border-color: var(--primary);
          box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.25);
        }

        .preset-avatar-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preset-selected-check {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .custom-url-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }

        .custom-url-field label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .url-submit-row {
          display: flex;
          gap: 8px;
        }

        .url-submit-row input {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 10px;
          color: #fff;
          outline: none;
          font-size: 0.85rem;
          flex-grow: 1;
        }

        .url-submit-row input:focus {
          border-color: var(--primary);
        }

        .apply-url-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 10px 16px;
          border-radius: 8px;
        }

        .apply-url-btn:hover {
          background: var(--primary);
        }

        /* Switch Account modal box */
        .switch-modal-box {
          width: 460px;
          padding: 28px;
          background: rgba(15, 15, 20, 0.95);
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }

        .accounts-list-rows {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 280px;
          overflow-y: auto;
          margin-top: 10px;
        }

        .account-switch-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .account-switch-row:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(var(--primary-rgb), 0.3);
          transform: translateX(2px);
        }

        .account-switch-row.active {
          border-color: var(--primary);
          background: rgba(var(--primary-rgb), 0.05);
        }

        .row-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .switch-avatar-small {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          object-fit: cover;
          border: 1.5px solid rgba(255, 255, 255, 0.08);
        }

        .switch-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }

        .switch-meta strong {
          font-size: 0.85rem;
          color: #fff;
        }

        .switch-meta span {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .current-indicator-badge {
          font-size: 0.7rem;
          font-weight: 700;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          padding: 3px 10px;
          border-radius: 6px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .load-badge {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.04);
          padding: 3px 10px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.2s ease;
        }

        .account-switch-row:hover .load-badge {
          color: #fff;
          background: var(--primary);
          border-color: transparent;
        }

        /* Image Generator Modal styling */
        .image-gen-modal-box {
          width: 820px;
          padding: 28px;
          background: rgba(15, 15, 20, 0.96);
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 30px 70px rgba(0,0,0,0.7);
        }

        .image-gen-layout {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 28px;
          margin-top: 10px;
        }

        .image-gen-input-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }

        .prompt-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .prompt-input-group label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .prompt-textarea {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px;
          color: #fff;
          outline: none;
          font-size: 0.85rem;
          line-height: 1.5;
          resize: none;
        }

        .prompt-textarea:focus {
          border-color: var(--primary);
        }

        .generate-submit-btn {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          color: #fff;
          font-size: 0.9rem;
          font-weight: 700;
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.25);
          transition: all 0.2s ease;
        }

        .generate-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.1);
        }

        .generate-submit-btn:disabled {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          box-shadow: none;
          cursor: not-allowed;
        }

        .request-cost-caption {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: center;
        }

        /* Image preview layout */
        .image-gen-preview-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .image-preview-frame {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.25);
          border: 1px dashed rgba(255, 255, 255, 0.1);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .empty-preview-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--text-muted);
          gap: 8px;
          text-align: center;
          padding: 24px;
        }

        .icon-placeholder-gen {
          color: rgba(255, 255, 255, 0.05);
          animation: float 4s infinite ease-in-out;
        }

        .empty-preview-placeholder span {
          font-family: var(--font-display);
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .empty-preview-placeholder p {
          font-size: 0.75rem;
          max-width: 200px;
          line-height: 1.4;
        }

        .rendered-ai-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Progress Steps Loader */
        .generation-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #fff;
        }

        .loader-ring {
          width: 42px;
          height: 42px;
          border: 3.5px solid rgba(var(--primary-rgb), 0.1);
          border-top: 3.5px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .step-txt {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .progress-bar-container {
          width: 180px;
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill-loading {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
          border-radius: 10px;
          animation: fillProgress 3.6s linear forwards;
        }

        @keyframes fillProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .post-generation-actions {
          display: flex;
          gap: 12px;
        }

        .set-avatar-action-btn {
          flex-grow: 1.5;
          background: var(--primary);
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 10px;
          border-radius: 8px;
        }

        .set-avatar-action-btn:hover {
          filter: brightness(1.1);
        }

        .download-action-btn {
          flex-grow: 1;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .download-action-btn:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        /* Password Modal */
        .password-modal {
          width: 380px;
          padding: 28px;
          background: rgba(15, 15, 20, 0.95);
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }

        .password-modal h3 {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }

        .password-modal p {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 20px;
        }

        .modal-fields {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }

        .modal-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .modal-input-group label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .modal-input-group input {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 10px;
          color: #fff;
          outline: none;
          font-size: 0.85rem;
        }

        .modal-input-group input:focus {
          border-color: var(--primary);
        }

        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .modal-btn-filled {
          background: var(--primary);
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 10px 16px;
          border-radius: 8px;
          flex-grow: 1;
        }

        .modal-btn-cancel {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
          padding: 10px 16px;
          border-radius: 8px;
        }

        .modal-btn-cancel:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }

        @media (max-width: 992px) {
          .profile-details-grid {
            grid-template-columns: 1fr;
          }
          .profile-security-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 860px) {
          .image-gen-modal-box {
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
          }
          .image-gen-layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 600px) {
          .header-card-layout {
            flex-direction: column;
            text-align: center;
          }
          .subscription-flex-row {
            flex-direction: column;
            align-items: stretch;
          }
          .password-modal, .avatar-modal-box, .switch-modal-box {
            width: 90%;
            padding: 20px;
          }
        }

        /* Sign up modal styles */
        .signup-modal-box {
          width: 380px;
          padding: 24px;
          background: rgba(15, 15, 20, 0.95);
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }

        .signup-modal-box h3 {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
          color: #fff;
        }

        .modal-fields {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
          margin-top: 8px;
        }

        .modal-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .modal-input-group label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .modal-input-group input {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 10px;
          color: #fff;
          outline: none;
          font-size: 0.85rem;
        }

        .modal-input-group input:focus {
          border-color: var(--primary);
        }

        .signup-avatars-presets {
          display: flex;
          gap: 10px;
          margin-top: 4px;
        }

        .signup-preset-img {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          object-fit: cover;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .signup-preset-img:hover {
          transform: scale(1.05);
        }

        .signup-preset-img.active {
          border-color: var(--primary);
        }

        .modal-actions-signup {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }

        .modal-btn-filled-signup {
          flex-grow: 1;
          background: var(--primary);
          color: #fff;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 10px;
          border-radius: 6px;
        }

        .modal-btn-cancel-signup {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
          padding: 10px 16px;
          border-radius: 6px;
        }

        /* Detail card highlight pulse keyframes */
        @keyframes highlightPulse {
          0% {
            transform: scale(1);
            border-color: rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          }
          50% {
            transform: scale(1.02) translateY(-4px);
            border-color: var(--primary);
            box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4);
          }
          100% {
            transform: scale(1);
            border-color: rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          }
        }

        .highlight-pulse {
          animation: highlightPulse 1.2s ease-in-out forwards;
          z-index: 10;
        }
      `}</style>
    </div>
  );
};
