
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

interface SettingsPageProps {
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (val: boolean) => void }> = ({ checked, onChange }) => (
    <button 
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate, onBack, showToast }) => {
  const { logout } = useAuth();
  
  // Notification State (persisted in localStorage for demo)
  const [notifications, setNotifications] = useState({
      safetyAlerts: true,
      appUpdates: true,
      systemNotices: true
  });
  
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
      const saved = localStorage.getItem('app_settings_notifications');
      if (saved) {
          setNotifications(JSON.parse(saved));
      }
  }, []);

  const handleToggle = (key: keyof typeof notifications) => {
      const newState = { ...notifications, [key]: !notifications[key] };
      setNotifications(newState);
      localStorage.setItem('app_settings_notifications', JSON.stringify(newState));
  };

  const handleChangePassword = () => {
      onNavigate(Screen.FORGOT_PASSWORD);
  };

  const handleDeleteAccount = () => {
      // for demo simply clear local storage and logout
      localStorage.clear();
      logout();
      setShowDeletePopup(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] relative">
      
      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
          <div className="absolute inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Are you sure?</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                      All your data, including medical history and chats, will be <strong>permanently deleted</strong>. This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                       <button 
                           onClick={() => setShowDeletePopup(false)} 
                           className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                           disabled={isDeleting}
                       >
                           Cancel
                       </button>
                       <button 
                           onClick={handleDeleteAccount} 
                           className="flex-1 py-3.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                           disabled={isDeleting}
                       >
                           {isDeleting ? "Deleting..." : "Yes, Delete"}
                       </button>
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-3">
         <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
         </button>
         <h1 className="text-xl font-bold text-slate-900">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        

        {/* Notifications */}
        <section>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Notifications</h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">Safety Alerts</p>
                            <p className="text-xs text-slate-500">Critical health warnings</p>
                        </div>
                    </div>
                    <ToggleSwitch checked={notifications.safetyAlerts} onChange={() => handleToggle('safetyAlerts')} />
                </div>

                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">App Updates</p>
                            <p className="text-xs text-slate-500">New features and improvements</p>
                        </div>
                    </div>
                    <ToggleSwitch checked={notifications.appUpdates} onChange={() => handleToggle('appUpdates')} />
                </div>

                 <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">System Notices</p>
                            <p className="text-xs text-slate-500">Maintenance and legal updates</p>
                        </div>
                    </div>
                    <ToggleSwitch checked={notifications.systemNotices} onChange={() => handleToggle('systemNotices')} />
                </div>
            </div>
        </section>

        {/* Danger Zone */}
        <section>
            <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-3 px-1">Danger Zone</h3>
            <div className="bg-red-50 rounded-2xl border border-red-100 overflow-hidden shadow-sm p-5">
                <h4 className="font-bold text-red-700 mb-1">Delete Account</h4>
                <p className="text-sm text-red-600/80 mb-4 leading-relaxed">
                    Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button 
                    onClick={() => setShowDeletePopup(true)}
                    className="w-full bg-white border border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors shadow-sm active:scale-95"
                >
                    Delete Account
                </button>
            </div>
        </section>

      </div>
    </div>
  );
};
