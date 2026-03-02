
import React from 'react';
import { UserProfile } from '../types';
import { DEFAULT_PROFILE_IMAGE } from '../constants';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
  onOpenSidebar: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogout, onOpenSidebar }) => {
  return (
    <div className="flex-1 bg-white flex flex-col h-full">
      <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-900">Profile</h1>
        <button onClick={onOpenSidebar}><svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 bg-[#F9FAFB]">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-3">
                 <img src={user.photoUrl || DEFAULT_PROFILE_IMAGE} alt="Profile" className="w-full h-full object-cover" />
                 {/* Only show edit icon if user is in edit mode, but here we just show the profile */}
            </div>
            <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-500 text-sm">{user.email}</p>
        </div>

        <div className="space-y-4">
            {/* General Info */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">General Info</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Phone</span>
                        <span className="font-medium text-slate-800">{user.phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Date of Birth</span>
                        <span className="font-medium text-slate-800">{user.dob}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Gender</span>
                        <span className="font-medium text-slate-800">{user.gender}</span>
                    </div>
                </div>
            </section>

             {/* Medical Info */}
             <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">Medical Info</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Height</span>
                        <span className="font-medium text-slate-800">{user.height ? `${user.height} cm` : '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Weight</span>
                        <span className="font-medium text-slate-800">{user.weight ? `${user.weight} kg` : '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Blood Group</span>
                        <span className="font-medium text-slate-800">{user.bloodGroup || '-'}</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Allergies</span>
                        <span className="font-medium text-slate-800">{user.allergies && user.allergies.length > 0 ? user.allergies.join(', ') : 'None'}</span>
                    </div>
                </div>
            </section>

            {/* Medical History */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-3">Medical History</h3>
                {user.conditions && user.conditions.length > 0 ? user.conditions.map((c, i) => (
                    <div key={i} className="flex gap-3 mb-2">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <div>
                            <p className="text-slate-800 font-medium text-sm">{c.name}</p>
                            <p className="text-xs text-slate-400">Since {c.since}</p>
                        </div>
                    </div>
                )) : <p className="text-sm text-slate-400">No medical history recorded.</p>}
            </section>

            {/* AI Diagnosis History */}
            <section className="bg-[#F0F9FF] rounded-xl p-5 border border-blue-100">
                <div className="flex justify-between items-center mb-3">
                     <h3 className="font-bold text-slate-900">Ai Diagnosis History</h3>
                     <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
                <div className="space-y-4">
                     <div className="flex gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <div>
                            <p className="text-slate-800 font-medium text-sm">Tension Headache</p>
                            <p className="text-xs text-slate-400">Dec 2025</p>
                        </div>
                    </div>
                    <div className="flex gap-3 border-t border-blue-100 pt-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <div>
                            <p className="text-slate-800 font-medium text-sm">Common Cold</p>
                            <p className="text-xs text-slate-400">Nov 2025</p>
                        </div>
                    </div>
                </div>
            </section>

             <button className="w-full bg-white border border-blue-200 text-blue-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export data
            </button>
            
            <div className="pt-4 text-center">
                <button onClick={onLogout} className="text-red-500 font-medium text-sm flex items-center justify-center gap-1 mx-auto">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
