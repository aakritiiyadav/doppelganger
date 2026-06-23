'use client';

import React, { useState } from 'react';
import { useApp, PageType } from '../context/AppContext';
import { Bell, Settings, User, Users, LogOut, Plus } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    accounts, 
    activeAccountId, 
    activeAccount, 
    switchAccount, 
    showBreadcrumbs,
    createAccount
  } = useApp();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpRole, setSignUpRole] = useState('');
  const [signUpAvatar, setSignUpAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');

  const presetAvatars = [
    { name: 'Default Engineer', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
    { name: 'Research Specialist', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
    { name: 'Tech Explorer', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }
  ];

  const handleSignUpSubmit = () => {
    if (signUpName.trim() && signUpEmail.trim()) {
      createAccount(signUpName, signUpEmail, signUpRole || 'User Profile', signUpAvatar);
      setSignUpName('');
      setSignUpEmail('');
      setSignUpRole('');
      setShowSignUpModal(false);
    }
  };

  const notifications = [
    'Iris optimized your work schedule by 15%',
    'Medico noted a positive sleep pattern change',
    'Vault reminder: You have reached 80% of your savings goal!',
    'NOVA system update completed successfully.'
  ];

  const getPageTitle = (page: PageType) => {
    switch (page) {
      case 'dashboard': return 'Dashboard Overview';
      case 'insights': return 'Performance & Insights';
      case 'customizations': return 'Appearance & Preferences';
      case 'profile': return 'User Profile Hub';
      default: return 'Doppelgänger Dashboard';
    }
  };

  const handleAccountSwitch = (id: string) => {
    switchAccount(id);
    setShowProfileMenu(false);
  };

  const handleViewProfile = () => {
    setCurrentPage('profile');
    setShowProfileMenu(false);
  };

  const handleViewCustom = () => {
    setCurrentPage('customizations');
    setShowProfileMenu(false);
  };

  const alternateAccounts = accounts.filter(acc => acc.id !== activeAccountId);

  return (
    <header className="header-container glass">
      <div className="header-left">
        {showBreadcrumbs && (
          <div className="breadcrumb">
            <span className="breadcrumb-root" onClick={() => setCurrentPage('dashboard')}>Portal</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{getPageTitle(currentPage)}</span>
          </div>
        )}
      </div>



      <div className="header-actions">
        {/* Notification center */}
        <div className="notification-bell-wrapper">
          <button 
            className="action-btn" 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            title="Notifications"
          >
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown glass animate-slide-in">
              <div className="dropdown-header">
                <h4>Recent Activities</h4>
                <button onClick={() => setShowNotifications(false)}>Clear</button>
              </div>
              <div className="dropdown-list">
                {notifications.map((notif, index) => (
                  <div key={index} className="dropdown-item">
                    <p>{notif}</p>
                    <span>Just now</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Customization link */}
        <button 
          className="action-btn" 
          onClick={() => {
            setCurrentPage('customizations');
            setShowNotifications(false);
            setShowProfileMenu(false);
          }}
          title="Customization Settings"
        >
          <Settings size={20} />
        </button>

        {/* Profile Avatar & Interactive Menu Dropdown */}
        <div className="user-profile-avatar-wrapper">
          <div 
            className="user-profile-avatar" 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >
            <img src={activeAccount.avatar} alt={activeAccount.name} />
            <div className="avatar-status-dot"></div>
          </div>

          {showProfileMenu && (
            <div className="profile-menu-dropdown glass animate-slide-in">
              <div className="menu-profile-header">
                <img src={activeAccount.avatar} alt={activeAccount.name} className="menu-avatar-large" />
                <div className="menu-profile-meta">
                  <h5>{activeAccount.name}</h5>
                  <span>{activeAccount.role}</span>
                </div>
              </div>

              <div className="menu-divider"></div>

              <div className="menu-links-group">
                <button className="menu-link-item" onClick={handleViewProfile}>
                  <User size={14} />
                  <span>View Full Profile</span>
                </button>
                <button className="menu-link-item" onClick={handleViewCustom}>
                  <Settings size={14} />
                  <span>Customizations</span>
                </button>
              </div>

              <div className="menu-divider"></div>

              <div className="menu-switch-accounts-section">
                <button 
                  className="menu-link-item create-account-header-btn"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowSignUpModal(true);
                  }}
                >
                  <Plus size={14} style={{ color: 'var(--primary)' }} />
                  <strong>Sign Up / Create New Account</strong>
                </button>
              </div>

              <div className="menu-divider"></div>

              <button className="menu-link-item logout-link" onClick={() => {
                setCurrentPage('welcome');
                setShowProfileMenu(false);
              }}>
                <LogOut size={14} />
                <span>Logout Session</span>
              </button>
            </div>
          )}
        </div>
      </div>

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

      <style jsx>{`
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
          font-size: 1.2rem;
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

        .modal-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .modal-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 12px;
          text-align: left;
        }

        .close-x-btn {
          font-size: 1.5rem;
          color: var(--text-muted);
          font-weight: 300;
        }

        .close-x-btn:hover {
          color: #fff;
        }

        .header-container {
          height: var(--header-height);
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-top: none;
          background: rgba(9, 9, 11, 0.4);
          position: sticky;
          top: 0;
          z-index: 99;
          margin-bottom: 24px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
        }

        .breadcrumb-root {
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .breadcrumb-root:hover {
          color: var(--primary);
        }

        .breadcrumb-separator {
          color: rgba(255, 255, 255, 0.2);
        }

        .breadcrumb-current {
          color: #fff;
          font-weight: 500;
        }



        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .notification-bell-wrapper {
          position: relative;
        }

        .action-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.2s ease;
          position: relative;
        }

        .action-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-1px);
        }

        .notification-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary);
          border: 2px solid var(--bg-app);
        }

        .notifications-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 320px;
          background: rgba(15, 15, 20, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          z-index: 100;
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 10px;
          margin-bottom: 12px;
        }

        .dropdown-header h4 {
          font-family: var(--font-display);
          font-weight: 600;
        }

        .dropdown-header button {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 500;
        }

        .dropdown-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 240px;
          overflow-y: auto;
        }

        .dropdown-item {
          padding: 8px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          transition: background 0.2s ease;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .dropdown-item p {
          font-size: 0.8rem;
          color: #e4e4e7;
          line-height: 1.4;
          margin-bottom: 4px;
        }

        .dropdown-item span {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        /* Profile Avatar & Dropdown */
        .user-profile-avatar-wrapper {
          position: relative;
        }

        .user-profile-avatar {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.08);
          transition: all 0.2s ease;
          position: relative;
        }

        .user-profile-avatar:hover {
          border-color: var(--primary);
          transform: scale(1.05);
        }

        .user-profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          border: 1.5px solid var(--bg-app);
        }

        /* Profile dropdown menu */
        .profile-menu-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 260px;
          background: rgba(15, 15, 20, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
          z-index: 100;
        }

        .menu-profile-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px;
        }

        .menu-avatar-large {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          object-fit: cover;
          border: 1.5px solid rgba(255, 255, 255, 0.08);
        }

        .menu-profile-meta h5 {
          font-family: var(--font-display);
          font-size: 0.9rem;
          color: #fff;
          font-weight: 600;
        }

        .menu-profile-meta span {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .menu-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin: 12px 0;
        }

        .menu-links-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .menu-link-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .menu-link-item:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.04);
        }

        .logout-link:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.08);
        }

        /* Switch account inside header dropdown */
        .menu-switch-accounts-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .menu-switch-accounts-section h6 {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding-left: 4px;
          margin-bottom: 2px;
        }

        .menu-switch-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .menu-switch-row-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 6px 8px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          transition: all 0.2s ease;
        }

        .menu-switch-row-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(var(--primary-rgb), 0.2);
          transform: translateX(2px);
        }

        .menu-switch-avatar-small {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .menu-switch-row-meta {
          display: flex;
          flex-direction: column;
          gap: 1px;
          text-align: left;
        }

        .menu-switch-row-meta strong {
          font-size: 0.75rem;
          color: #e4e4e7;
          font-weight: 600;
        }

        .menu-switch-row-meta span {
          font-size: 0.65rem;
          color: var(--text-muted);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 150px;
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 0 16px;
          }
          .breadcrumb {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
