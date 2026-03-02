
import React from 'react';
import { UserProfile, Screen } from '../types';
import { COMMON_CONDITIONS, DEFAULT_PROFILE_IMAGE } from '../constants';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
  onOpenSidebar: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onOpenSidebar }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F0F4F8]">
      {/* Blue Header Section */}
      <div className="bg-white p-6 pb-2">
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3" onClick={() => onNavigate(Screen.PROFILE)}>
                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm cursor-pointer">
                     <img src={user.photoUrl || DEFAULT_PROFILE_IMAGE} alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="cursor-pointer">
                    <p className="text-slate-500 text-sm">Hello,</p>
                    <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
                </div>
            </div>
            <button onClick={onOpenSidebar} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100">
                <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
         </div>

         {/* Call to Action Card */}
         <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden mb-6">
            <div className="relative z-10">
                <h2 className="text-xl font-bold mb-1">How are you feeling today?</h2>
                <p className="text-blue-100 text-sm mb-4">Get personalized health guidance</p>
                <button 
                    onClick={() => onNavigate(Screen.SAFETY_CHECK)}
                    className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 active:scale-95 transition-all"
                >
                    Start Chat
                </button>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500 rounded-full opacity-50" />
            <div className="absolute right-10 bottom-[-20px] w-20 h-20 bg-blue-400 rounded-full opacity-30" />
         </div>
      </div>

      <div className="px-6 py-4 space-y-8 pb-32">
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-3 gap-3">
            <button onClick={() => onNavigate(Screen.SAFETY_CHECK)} className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform border border-slate-100 h-32">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">New Check</span>
            </button>
            <button onClick={() => onNavigate(Screen.SEARCH)} className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform border border-slate-100 h-32">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Search medicine</span>
            </button>
            <button onClick={() => onNavigate(Screen.HISTORY)} className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform border border-slate-100 h-32">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                     <span className="font-bold text-lg font-serif italic">Rx</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Prescriptions</span>
            </button>
        </div>

        {/* Health Tips */}
        <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Health Tips</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                <div className="min-w-[280px] bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-center shadow-sm">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Stay Hydrated</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Drink at least 8 glasses of water daily for optimal health</p>
                    </div>
                </div>
                 <div className="min-w-[280px] bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-center shadow-sm">
                    <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 flex-shrink-0">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Morning Walk</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">30 mins of walk improves heart health significantly</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Common Conditions */}
        <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Common Conditions</h3>
            <div className="flex flex-wrap gap-2">
                {COMMON_CONDITIONS.map((c, i) => (
                    <button key={i} className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50">
                        {c.name}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
