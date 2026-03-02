
import React from 'react';
import { UserProfile, Screen } from '../types';
import { useChat } from '../context/ChatContext';
import { DEFAULT_PROFILE_IMAGE } from '../constants';

interface SidebarProps {
    user: UserProfile;
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    onNavigate: (screen: Screen) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, onClose, onLogout, onNavigate }) => {
    const { createNewSession, messages, currentSessionId } = useChat();

    if (!isOpen) return null;

    const handleNavigation = (screen: Screen) => {
        onNavigate(screen);
        onClose();
    };

    const menuItems = [
        { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, label: 'Edit Profile', screen: Screen.EDIT_PROFILE },
        { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Chat History', screen: Screen.HISTORY },
        { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, label: 'Settings', screen: Screen.SETTINGS },
        { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, label: 'Data & Privacy', screen: Screen.DATA_PRIVACY },
        { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>, label: 'Safety & Disclaimers', screen: Screen.SAFETY_DISCLAIMERS },
        { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Help & Support', screen: Screen.HELP_SUPPORT },
        { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'About AI Pharmacist', screen: Screen.ABOUT_APP },
    ];

    return (
        <div className="absolute inset-0 z-50 flex">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            
            {/* Sidebar Content */}
            <div className="relative bg-white w-3/4 h-full shadow-2xl flex flex-col animate-slide-in-left">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Menu</h2>
                    <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200">
                            <img src={user.photoUrl || DEFAULT_PROFILE_IMAGE} alt="Profile" className="w-full h-full object-cover" />
                         </div>
                         <div className="overflow-hidden">
                             <p className="font-bold text-slate-900 truncate">{user.name}</p>
                             <p className="text-xs text-slate-500 truncate">{user.email}</p>
                         </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    {menuItems.map((item, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleNavigation(item.screen!)} 
                            className={`w-full flex items-center gap-4 px-6 py-4 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors`}
                        >
                            {item.icon}
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-6 border-t border-slate-100">
                    <button onClick={onLogout} className="flex items-center gap-4 text-red-500 font-bold">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};
