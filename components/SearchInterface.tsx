
import React, { useState } from 'react';
import { MOCK_MEDICINES } from '../constants';
import { Medicine } from '../types';
import { Button } from './ui/Button';

export const SearchInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Medicine[]>(MOCK_MEDICINES);
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Trigger search on Enter or button click
  const handleSearch = () => {
      if (!query.trim()) {
          setResults(MOCK_MEDICINES);
          setHasSearched(false);
          return;
      }

      setIsSearching(true);
      setHasSearched(true);

      // simple filter on mock data
      const lower = query.toLowerCase();
      const filtered = MOCK_MEDICINES.filter(m =>
          m.name.toLowerCase().includes(lower) || m.genericName.toLowerCase().includes(lower)
      );
      setResults(filtered);
      setIsSearching(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          handleSearch();
      }
  };

  // --- DETAIL VIEW (Native UI) ---
  if (selectedMed) {
      return (
        <div className="flex flex-col h-full bg-white animate-slide-in-right">
            {/* Header */}
            <div className="p-4 border-b flex items-center bg-white sticky top-0 z-20 shadow-sm">
                <button 
                    onClick={() => setSelectedMed(null)} 
                    className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h1 className="flex-1 text-center font-bold text-slate-900 truncate pr-10">Drug Details</h1>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50">
                {/* Brand Header */}
                <div className="bg-white p-6 pb-8 border-b border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{selectedMed.name}</h2>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Tablet
                        </span>
                    </div>
                    <p className="text-lg text-slate-600 font-medium mb-1">{selectedMed.genericName}</p>
                    <p className="text-sm text-slate-400">{selectedMed.manufacturer}</p>
                </div>

                <div className="p-5 space-y-5">
                    
                    {/* Description Section */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <h3 className="font-bold text-slate-900">Indications & Usage</h3>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            {selectedMed.uses}
                        </p>
                        <div className="mt-3 pt-3 border-t border-slate-50">
                             <p className="text-xs text-slate-500 italic">{selectedMed.description}</p>
                        </div>
                    </div>

                    {/* Dosage Section */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <h3 className="font-bold text-slate-900">Dosage</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-1 bg-emerald-100 rounded-full"></div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Adults</p>
                                    <p className="text-slate-800 font-medium">{selectedMed.dosage.adults}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1 bg-emerald-100 rounded-full"></div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Children</p>
                                    <p className="text-slate-800 font-medium">{selectedMed.dosage.children}</p>
                                </div>
                            </div>
                            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-1">Max Daily Dose</p>
                                <p className="text-emerald-700 font-bold">{selectedMed.dosage.maximum}</p>
                            </div>
                        </div>
                    </div>

                    {/* Side Effects Section */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <h3 className="font-bold text-slate-900">Common Side Effects</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedMed.sideEffects.map((effect, i) => (
                                <span key={i} className="bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                                    {effect}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-slate-100 p-4 rounded-xl text-center">
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Data Source: {selectedMed.source}. <br/>
                            Always consult a doctor before taking medication. This information is for reference only.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Bottom Action Bar */}
            <div className="p-4 bg-white border-t sticky bottom-0">
                <Button fullWidth onClick={() => setSelectedMed(null)}>
                    Back to Search
                </Button>
            </div>
        </div>
      );
  }

  // --- SEARCH VIEW ---
  return (
    <div className="flex-1 bg-[#F9FAFB] flex flex-col h-full">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Search Medicines</h1>
        <div className="relative">
             <input 
                placeholder="Search by brand or generic name..." 
                value={query} 
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            
            {/* Action Icon in Input */}
            <button 
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                disabled={isSearching}
            >
                {isSearching ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                )}
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3">
        {/* Title indicating what is being shown */}
        <div className="flex justify-between items-center px-1">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                 {isSearching ? "Searching AI Database..." : hasSearched && results.length > 0 ? `Results for "${query}"` : "Popular Medicines"}
             </h3>
             {hasSearched && !isSearching && results.length > 0 && (
                 <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 font-medium">AI Generated</span>
             )}
        </div>

        {isSearching && (
             <div className="space-y-3">
                 {[1, 2, 3].map(i => (
                     <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
                         <div className="h-5 bg-slate-100 rounded w-1/3 mb-2"></div>
                         <div className="h-3 bg-slate-100 rounded w-1/4 mb-4"></div>
                         <div className="h-10 bg-slate-50 rounded w-full"></div>
                     </div>
                 ))}
             </div>
        )}

        {!isSearching && results.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-10 opacity-60">
                <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-slate-500 font-medium">No medicines found</p>
                <button onClick={() => { setQuery(''); setResults(MOCK_MEDICINES); setHasSearched(false); }} className="text-blue-600 text-sm font-bold mt-2">Clear Search</button>
            </div>
        ) : (
            !isSearching && results.map((med, idx) => (
                <div 
                    key={med.id || idx} 
                    onClick={() => setSelectedMed(med)} 
                    className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{med.name}</h3>
                            <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                {med.genericName}
                            </span>
                        </div>

                        <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{med.description}</p>
                        
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium border-t border-slate-50 pt-3 mt-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            {med.manufacturer || "Various"}
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
