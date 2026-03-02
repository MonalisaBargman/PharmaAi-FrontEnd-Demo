
import React, { useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { ChatSession } from '../types';

interface HistoryInterfaceProps {
    initialSessionId?: string | null;
    onSessionSelect: (sessionId: string) => void;
    onResumeChat?: () => void;
    onBack?: () => void; // Added onBack prop
}


export const HistoryInterface: React.FC<HistoryInterfaceProps> = ({ initialSessionId, onSessionSelect, onResumeChat, onBack }) => {
  const { sessions, messages, loadSession, deleteSession } = useChat();
  const [viewSessionId, setViewSessionId] = useState<string | null>(initialSessionId || null);
  // no summary generation in demo

  // Menu States
  const [activeOptionSessionId, setActiveOptionSessionId] = useState<string | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [sessionToReport, setSessionToReport] = useState<string | null>(null);

  useEffect(() => {
      if (initialSessionId) setViewSessionId(initialSessionId);
  }, [initialSessionId]);

  // summary generation removed for demo

  const handleDeleteConfirm = () => {
      if (sessionToDelete) {
          deleteSession(sessionToDelete);
          setSessionToDelete(null);
          // If we deleted the currently viewed session, go back to list
          if (viewSessionId === sessionToDelete) {
              setViewSessionId(null);
          }
      }
  };

  const handleReportConfirm = () => {
      if (sessionToReport) {
          deleteSession(sessionToReport); // For now, reporting also removes it locally
          setSessionToReport(null);
          if (viewSessionId === sessionToReport) {
              setViewSessionId(null);
          }
      }
  };

  // --- DETAIL VIEW ---
  if (viewSessionId) {
      const session = sessions.find(s => s.id === viewSessionId);
      
      const handleGoToChat = () => {
          loadSession(viewSessionId); // Set as current in context
          if (onResumeChat) onResumeChat(); // Navigate to Chat Screen
      };

      if (!session) return <div>Session not found</div>;

      return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                    <button onClick={() => setViewSessionId(null)}>
                        <svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <h1 className="font-bold text-lg text-slate-900 truncate max-w-[200px]">{session.title}</h1>
                </div>
                {/* Severity Badge */}
                <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${
                    session.severity === 'red' ? 'bg-red-100 text-red-600' :
                    session.severity === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                }`}>
                    {session.severity}
                </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                <p className="text-center text-slate-400">(Summary not available in demo. Resume chat to view messages.)</p>
            </div>

            <div className="p-4 border-t bg-white sticky bottom-0">
                <button 
                    onClick={handleGoToChat}
                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    <span>Resume Chat</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
            </div>
        </div>
      );
  }

  // --- LIST VIEW ---
  return (
    <div className="flex-1 bg-[#F9FAFB] flex flex-col h-full relative">
      
      {/* Confirmation Popup */}
      {(sessionToDelete || sessionToReport) && (
          <div className="absolute inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl scale-100">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4 ring-4 ring-red-50">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Are you sure?</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                      {sessionToDelete ? "This chat session will be permanently deleted from your history." : "This content will be reported for safety review and removed."}
                  </p>
                  <div className="flex gap-3">
                       <button 
                           onClick={() => { setSessionToDelete(null); setSessionToReport(null); }} 
                           className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                       >
                           Cancel
                       </button>
                       <button 
                           onClick={sessionToDelete ? handleDeleteConfirm : handleReportConfirm} 
                           className="flex-1 py-3.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
                       >
                           {sessionToDelete ? "Delete" : "Report"}
                       </button>
                  </div>
              </div>
          </div>
      )}

      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-3">
         {onBack && (
             <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             </button>
         )}
         <h1 className="text-xl font-bold text-slate-900">History</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3" onClick={() => setActiveOptionSessionId(null)}>
        {sessions.length === 0 && (
            <div className="text-center mt-10 text-slate-400">
                <p>No chat history available.</p>
            </div>
        )}
        {sessions.map(session => (
            <div 
                key={session.id} 
                onClick={() => {
                    setViewSessionId(session.id);
                    onSessionSelect(session.id);
                }} 
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors relative group"
            >
                <div className="flex justify-between items-start mb-2 pr-8">
                    <h3 className="font-bold text-slate-900 truncate flex-1 pr-2">{session.title}</h3>
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        session.severity === 'red' ? 'bg-red-500' :
                        session.severity === 'yellow' ? 'bg-yellow-400' :
                        'bg-blue-500'
                    }`} />
                </div>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">{session.snippet || "No messages"}</p>
                <div className="border-t pt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>{new Date(session.lastUpdated).toLocaleDateString()} • {new Date(session.lastUpdated).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>

                {/* 3 Dot Option Button */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveOptionSessionId(activeOptionSessionId === session.id ? null : session.id);
                    }}
                    className={`absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors ${activeOptionSessionId === session.id ? 'bg-slate-100 text-slate-600' : ''}`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                </button>

                {/* Dropdown Menu */}
                {activeOptionSessionId === session.id && (
                    <div className="absolute right-3 top-10 w-36 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-fade-in ring-1 ring-black/5">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setSessionToDelete(session.id); setActiveOptionSessionId(null); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Delete
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setSessionToReport(session.id); setActiveOptionSessionId(null); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 font-medium flex items-center gap-2 border-t border-slate-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            Report
                        </button>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};
