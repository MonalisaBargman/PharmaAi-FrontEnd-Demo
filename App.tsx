
import React, { useState, useEffect } from 'react';
import { Screen, UserProfile, ToastState } from './types';
import { AuthFlow } from './components/AuthFlow';
import { Dashboard } from './components/Dashboard';
import { ChatInterface } from './components/ChatInterface';
import { SearchInterface } from './components/SearchInterface';
import { Profile } from './components/Profile';
import { HistoryInterface } from './components/HistoryInterface';
import { SafetyCheck } from './components/SafetyCheck';
import { ImportantNotice } from './components/ImportantNotice';
import { Sidebar } from './components/Sidebar';
import { EditProfile } from './components/EditProfile';
import { SettingsPage } from './components/SettingsPage';
import { PlaceholderPage } from './components/PlaceholderPage';
import { Toast } from './components/ui/Toast';
import { ChatProvider } from './context/ChatContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EMPTY_USER_PROFILE } from './constants';

const AppContent: React.FC = () => {
  const { user, loading, logout, updateUser } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Redirect to Dashboard (or Notice) on Login
  useEffect(() => {
    if (user && currentScreen === Screen.LOGIN) {
      setCurrentScreen(Screen.IMPORTANT_NOTICE);
    }
  }, [user, currentScreen]);

  const handleLogout = async () => {
    setIsSidebarOpen(false);
    await logout();
    setCurrentScreen(Screen.LOGIN);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
      setToast({ show: true, message, type });
  };

  const handleUpdateProfile = async (updatedUser: UserProfile) => {
      // simply update auth context state
      updateUser(updatedUser);
      setCurrentScreen(Screen.PROFILE);
      showToast("Profile updated successfully!");
  };

  const handleSessionSelect = (sessionId: string) => {
      setSelectedSessionId(sessionId);
      setCurrentScreen(Screen.SESSION_DETAILS);
  };

  const handleResumeChat = () => {
      setCurrentScreen(Screen.CHAT);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderScreen = () => {
    if (!user) {
        return (
            <AuthFlow 
                onNavigate={setCurrentScreen}
                showToast={showToast}
            />
        );
    }

    switch (currentScreen) {
        case Screen.IMPORTANT_NOTICE:
            return <ImportantNotice onConfirm={() => setCurrentScreen(Screen.DASHBOARD)} />;
        case Screen.DASHBOARD:
            return <Dashboard user={user} onNavigate={setCurrentScreen} onOpenSidebar={() => setIsSidebarOpen(true)} />;
        case Screen.SAFETY_CHECK:
            return <SafetyCheck onPass={() => setCurrentScreen(Screen.CHAT)} onCancel={() => setCurrentScreen(Screen.DASHBOARD)} />;
        case Screen.CHAT:
            return <ChatInterface onBack={() => setCurrentScreen(Screen.DASHBOARD)} onNavigate={setCurrentScreen} />;
        case Screen.SEARCH:
            return <SearchInterface />;
        case Screen.HISTORY:
            return <HistoryInterface onSessionSelect={handleSessionSelect} onBack={() => setCurrentScreen(Screen.DASHBOARD)} />;
        case Screen.SESSION_DETAILS:
            return <HistoryInterface initialSessionId={selectedSessionId} onSessionSelect={handleSessionSelect} onResumeChat={handleResumeChat} onBack={() => setCurrentScreen(Screen.DASHBOARD)} />;
        case Screen.PROFILE:
            return <Profile user={user} onLogout={handleLogout} onOpenSidebar={() => setIsSidebarOpen(true)} />;
        case Screen.EDIT_PROFILE:
            return <EditProfile user={user} onSave={handleUpdateProfile} onCancel={() => setCurrentScreen(Screen.PROFILE)} />;
        case Screen.SETTINGS:
            return <SettingsPage onNavigate={setCurrentScreen} onBack={() => setCurrentScreen(Screen.DASHBOARD)} showToast={showToast} />;
        
        // Placeholders
        case Screen.NOTIFICATIONS_SETTINGS:
            return <PlaceholderPage title="Notifications Settings" onBack={() => setCurrentScreen(Screen.DASHBOARD)} />;
        case Screen.DATA_PRIVACY:
            return <PlaceholderPage title="Data & Privacy" onBack={() => setCurrentScreen(Screen.DASHBOARD)} />;
        case Screen.SAFETY_DISCLAIMERS:
            return <PlaceholderPage title="Safety & Disclaimers" onBack={() => setCurrentScreen(Screen.DASHBOARD)} />;
        case Screen.HELP_SUPPORT:
            return <PlaceholderPage title="Help & Support" onBack={() => setCurrentScreen(Screen.DASHBOARD)} />;
        case Screen.ABOUT_APP:
            return <PlaceholderPage title="About AI Pharmacist" onBack={() => setCurrentScreen(Screen.DASHBOARD)} />;
            
        case Screen.LOGIN: // Fallback if somehow state desyncs
        default:
            return <Dashboard user={user} onNavigate={setCurrentScreen} onOpenSidebar={() => setIsSidebarOpen(true)} />;
    }
  };

  const showNav = !!user && [Screen.DASHBOARD, Screen.SEARCH, Screen.HISTORY, Screen.PROFILE].includes(currentScreen);

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-white shadow-2xl overflow-hidden flex flex-col relative font-sans">
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      
      <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          user={user || EMPTY_USER_PROFILE} 
          onLogout={handleLogout}
          onNavigate={setCurrentScreen}
      />
      
      <main className="flex-1 overflow-hidden relative">
        {renderScreen()}
      </main>

      {showNav && (
        <nav className="h-[76px] bg-white border-t border-slate-100 flex justify-around items-center px-4 absolute bottom-0 w-full z-40 pb-2">
            <NavButton 
                active={currentScreen === Screen.DASHBOARD} 
                onClick={() => setCurrentScreen(Screen.DASHBOARD)} 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />} 
                label="Home"
            />
             <NavButton 
                active={currentScreen === Screen.CHAT} 
                onClick={() => setCurrentScreen(Screen.SAFETY_CHECK)} 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />} 
                label="Chat"
            />
             <NavButton 
                active={currentScreen === Screen.SEARCH} 
                onClick={() => setCurrentScreen(Screen.SEARCH)} 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />} 
                label="Search"
            />
             <NavButton 
                active={currentScreen === Screen.PROFILE} 
                onClick={() => setCurrentScreen(Screen.PROFILE)} 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />} 
                label="Profile"
            />
        </nav>
      )}
    </div>
  );
};

const NavButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
            active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icon}
        </svg>
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);

const App: React.FC = () => (
  <AuthProvider>
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  </AuthProvider>
);

export default App;
