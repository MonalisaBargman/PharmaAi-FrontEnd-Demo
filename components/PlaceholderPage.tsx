import React from 'react';

interface PlaceholderPageProps {
  title: string;
  onBack: () => void;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b flex items-center">
        <button onClick={onBack}>
          <svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="ml-4 text-lg font-bold text-slate-900">{title}</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
             <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Coming Soon</h2>
        <p className="text-slate-500">The {title} page is currently under development.</p>
      </div>
    </div>
  );
};