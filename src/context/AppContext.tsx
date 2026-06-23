'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type PageType = 'welcome' | 'dashboard' | 'insights' | 'customizations' | 'profile';
export type AgentType = 'nova' | 'medico' | 'iris' | 'vault' | 'vibe';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dob: string;
  role: string;
  avatar: string;
  twoFactorEnabled: boolean;
  remainingRequests: number;
  totalRequestsLimit: number;
  topicsCount: number;
  imagesCount: number;
  spentRequests: number;
  subscriptionName: string;
}

export interface AppContextType {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  toggles: Record<Exclude<AgentType, 'nova'>, boolean>;
  setToggle: (agent: Exclude<AgentType, 'nova'>, val: boolean) => void;
  activeChatAgent: AgentType;
  setActiveChatAgent: (agent: AgentType) => void;
  isChatActive: boolean;
  setIsChatActive: (val: boolean) => void;
  chatHistories: Record<AgentType, ChatMessage[]>;
  addMessage: (agent: AgentType, sender: 'user' | 'ai', text: string) => void;
  clearChat: (agent: AgentType) => void;
  
  // Customizations
  layoutStyle: 'grid' | 'list';
  setLayoutStyle: (style: 'grid' | 'list') => void;
  widgetSize: 'standard' | 'compact';
  setWidgetSize: (size: 'standard' | 'compact') => void;
  autoRefresh: boolean;
  setAutoRefresh: (val: boolean) => void;
  showBreadcrumbs: boolean;
  setShowBreadcrumbs: (val: boolean) => void;
  collapsibleSidebar: boolean;
  setCollapsibleSidebar: (val: boolean) => void;

  // Notifications preferences
  modelUpdates: boolean;
  setModelUpdates: (val: boolean) => void;
  systemMaintenance: boolean;
  setSystemMaintenance: (val: boolean) => void;
  performanceInsights: boolean;
  setPerformanceInsights: (val: boolean) => void;

  // Appearance
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  colorScheme: 'scheme-1' | 'scheme-2' | 'scheme-3' | 'scheme-4';
  setColorScheme: (scheme: 'scheme-1' | 'scheme-2' | 'scheme-3' | 'scheme-4') => void;
  
  // Accounts System
  accounts: Account[];
  activeAccountId: string;
  activeAccount: Account;
  switchAccount: (id: string) => void;
  updateActiveAccount: (details: Partial<Account>) => void;
  createAccount: (name: string, email: string, role: string, avatar: string) => void;
  profileCompletion: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialChatHistories: Record<AgentType, ChatMessage[]> = {
  nova: [
    { id: '1', sender: 'ai', text: 'Hello! I am NOVA, your central AI assistant. How can I help you coordinate your digital life today?', timestamp: '10:00 AM' }
  ],
  medico: [
    { id: '1', sender: 'ai', text: 'Hello! I am Medico, your health assistant. Ready to help keep your fitness and health in check today.', timestamp: '10:02 AM' }
  ],
  iris: [
    { id: '1', sender: 'ai', text: 'Hello! I am Iris, your work & study mentor. What topics are we analyzing today?', timestamp: '10:05 AM' }
  ],
  vault: [
    { id: '1', sender: 'ai', text: 'Hello! I am Vault, your secure finance advisor. Lets check your budget and savings plans.', timestamp: '10:10 AM' }
  ],
  vibe: [
    { id: '1', sender: 'ai', text: 'Hey there! Im Vibe, your lifestyle and balance partner. Ready to flow and structure your daily routine?', timestamp: '10:12 AM' }
  ]
};

const initialAccounts: Account[] = [
  {
    id: 'you',
    name: 'YOU',
    email: 'Xyz@Company.com',
    mobile: '(+91)9876-543-210',
    dob: '2005-01-01',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    twoFactorEnabled: true,
    remainingRequests: 900,
    totalRequestsLimit: 2000,
    topicsCount: 126,
    imagesCount: 789,
    spentRequests: 50124,
    subscriptionName: 'Basic Subscription'
  },
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.j@lab.org',
    mobile: '(+1) 555-019-2834',
    dob: '1992-06-15',
    role: 'AI Research Scientist',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    twoFactorEnabled: true,
    remainingRequests: 18450,
    totalRequestsLimit: 20000,
    topicsCount: 512,
    imagesCount: 2314,
    spentRequests: 128456,
    subscriptionName: 'Enterprise Plan'
  },
  {
    id: 'guest',
    name: 'Guest User',
    email: 'guest@nova.link',
    mobile: '(+44) 7700-900077',
    dob: '2000-11-20',
    role: 'Tech Explorer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    twoFactorEnabled: false,
    remainingRequests: 10,
    totalRequestsLimit: 50,
    topicsCount: 3,
    imagesCount: 0,
    spentRequests: 40,
    subscriptionName: 'Free Trial'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('welcome');
  const [toggles, setToggles] = useState<Record<Exclude<AgentType, 'nova'>, boolean>>({
    medico: true,
    iris: true,
    vault: false,
    vibe: true
  });
  const [activeChatAgent, setActiveChatAgent] = useState<AgentType>('nova');
  const [isChatActive, setIsChatActive] = useState<boolean>(false);
  const [chatHistories, setChatHistories] = useState<Record<AgentType, ChatMessage[]>>(initialChatHistories);

  // Customization States
  const [layoutStyle, setLayoutStyle] = useState<'grid' | 'list'>('grid');
  const [widgetSize, setWidgetSize] = useState<'standard' | 'compact'>('standard');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [showBreadcrumbs, setShowBreadcrumbs] = useState<boolean>(true);
  const [collapsibleSidebar, setCollapsibleSidebar] = useState<boolean>(false);

  // Notification Preferences States
  const [modelUpdates, setModelUpdates] = useState<boolean>(true);
  const [systemMaintenance, setSystemMaintenance] = useState<boolean>(false);
  const [performanceInsights, setPerformanceInsights] = useState<boolean>(true);

  // Appearance States
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [colorScheme, setColorScheme] = useState<'scheme-1' | 'scheme-2' | 'scheme-3' | 'scheme-4'>('scheme-1');

  // Accounts System State
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [activeAccountId, setActiveAccountId] = useState<string>('you');

  // Derived Active Account state
  const activeAccount = accounts.find(acc => acc.id === activeAccountId) || accounts[0];

  // Load custom styling attributes dynamically
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-scheme', colorScheme);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [theme, colorScheme, fontSize]);

  const setToggle = (agent: Exclude<AgentType, 'nova'>, val: boolean) => {
    setToggles(prev => ({
      ...prev,
      [agent]: val
    }));
  };

  const addMessage = (agent: AgentType, sender: 'user' | 'ai', text: string) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistories(prev => ({
      ...prev,
      [agent]: [
        ...prev[agent],
        {
          id: Math.random().toString(36).substr(2, 9),
          sender,
          text,
          timestamp: timeString
        }
      ]
    }));
  };

  const clearChat = (agent: AgentType) => {
    setChatHistories(prev => ({
      ...prev,
      [agent]: [
        {
          id: '1',
          sender: 'ai',
          text: `Chat cleared. Hi, how can I assist you as ${agent.toUpperCase()}?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }));
  };

  const switchAccount = (id: string) => {
    if (accounts.some(acc => acc.id === id)) {
      setActiveAccountId(id);
    }
  };

  const updateActiveAccount = (details: Partial<Account>) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === activeAccountId) {
        return {
          ...acc,
          ...details
        };
      }
      return acc;
    }));
  };

  const createAccount = (name: string, email: string, role: string, avatar: string) => {
    const newAcc: Account = {
      id: Math.random().toString(36).substring(2, 9),
      name: name,
      email: email,
      mobile: '',
      dob: '',
      role: role,
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      twoFactorEnabled: false,
      topicsCount: 0,
      imagesCount: 0,
      spentRequests: 0,
      remainingRequests: 1000,
      totalRequestsLimit: 1000,
      subscriptionName: 'Free Tier'
    };
    setAccounts(prev => [...prev, newAcc]);
    setActiveAccountId(newAcc.id);
  };

  // Profile completion calculations
  const [profileCompletion, setProfileCompletion] = useState(80);

  useEffect(() => {
    let score = 0;
    if (activeAccount.name && activeAccount.name !== '') score += 20;
    if (activeAccount.email && activeAccount.email !== '') score += 20;
    if (activeAccount.mobile && activeAccount.mobile !== '') score += 20;
    if (activeAccount.dob && activeAccount.dob !== '') score += 20;
    if (activeAccount.role && activeAccount.role !== '') score += 20;
    setProfileCompletion(score);
  }, [activeAccount]);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        toggles,
        setToggle,
        activeChatAgent,
        setActiveChatAgent,
        isChatActive,
        setIsChatActive,
        chatHistories,
        addMessage,
        clearChat,
        
        // Customizations
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

        // Notifications
        modelUpdates,
        setModelUpdates,
        systemMaintenance,
        setSystemMaintenance,
        performanceInsights,
        setPerformanceInsights,

        // Appearance
        theme,
        setTheme,
        fontSize,
        setFontSize,
        colorScheme,
        setColorScheme,

        // Accounts System
        accounts,
        activeAccountId,
        activeAccount,
        switchAccount,
        updateActiveAccount,
        createAccount,
        profileCompletion
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
