import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { Attachment, Screen } from '../types';

function generateDemoResponse(userMessage: string): string {
  if (userMessage.toLowerCase().includes("fever")) {
    return "You may have a mild viral infection. Please rest and drink fluids. Consult a doctor if symptoms worsen.";
  }

  if (userMessage.toLowerCase().includes("headache")) {
    return "Headaches can occur due to stress or dehydration. Try resting and drinking water.";
  }

  return "Thank you for your message. This is a demo AI response for frontend presentation.";
}

interface ChatInterfaceProps {
    onBack: () => void;
    onNavigate: (screen: Screen) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBack, onNavigate }) => {
  const { currentSessionId, messages, sessions, createNewSession, sendMessage, loadSession, deleteSession, clearCurrentSession } = useChat();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [activeOptionSessionId, setActiveOptionSessionId] = useState<string | null>(null);
  
  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Popup States
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [sessionToReport, setSessionToReport] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-create session if null
  useEffect(() => {
    if (!currentSessionId) {
       createNewSession();
    }
  }, [currentSessionId, createNewSession]);

  const activeMessages = currentSessionId ? messages[currentSessionId] || [] : [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages, isLoading, attachments.length]);

  const handleSend = async (text: string = input) => {
    if ((!text.trim() && attachments.length === 0) || isLoading || !currentSessionId) return;

    const currentAttachments = [...attachments];
    const currentText = text;

    // 1. User Message -> Updates Context
    sendMessage(currentText, 'user', { attachments: currentAttachments });
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    // Simply generate a demo AI response
    const botReplyText = generateDemoResponse(currentText);
    const safetyFlags: string[] = [];
    const diagnosisData = undefined;

    // 5. Bot Message -> Updates Context
    sendMessage(botReplyText, 'bot', { 
        safetyFlags,
        isDiagnosis: !!diagnosisData,
        diagnosisData
    });
    
    setIsLoading(false);
  };

  const handleNewChat = () => {
      const hasUserMessages = activeMessages.some(m => m.sender === 'user');
      
      if (!hasUserMessages) {
          setShowChatMenu(false);
          return;
      }
      
      clearCurrentSession();
      onNavigate(Screen.SAFETY_CHECK);
      setShowChatMenu(false);
  };

  const handleSessionSelect = (id: string) => {
      loadSession(id);
      setShowChatMenu(false);
  };

  const handleDeleteConfirm = () => {
      if (sessionToDelete) {
          deleteSession(sessionToDelete);
          setSessionToDelete(null);
      }
  };

  const handleReportConfirm = () => {
      if (sessionToReport) {
          deleteSession(sessionToReport);
          setSessionToReport(null);
      }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          
          reader.onload = (event) => {
              if (event.target?.result) {
                  const base64String = (event.target.result as string).split(',')[1];
                  setAttachments(prev => [...prev, {
                      name: file.name,
                      mimeType: file.type,
                      data: base64String,
                      type: file.type.includes('pdf') ? 'pdf' : 'image'
                  }]);
              }
          };
          
          reader.readAsDataURL(file);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
      setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative font-sans">
      
      {/* --- POPUPS --- */}
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

      {/* --- SIDEBAR MENU --- */}
      {showChatMenu && (
          <div className="absolute inset-0 z-50 flex justify-end overflow-hidden">
              <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setShowChatMenu(false)} />
              <div className="relative bg-white/95 backdrop-blur-xl w-[85%] max-w-sm h-full shadow-2xl flex flex-col animate-slide-in-right border-l border-white/50">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
                      <h2 className="font-bold text-slate-900 text-xl tracking-tight">Chats</h2>
                      <button onClick={() => setShowChatMenu(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                          <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>
                  
                  <div className="p-5">
                      <button 
                        onClick={handleNewChat}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30 active:scale-95 transition-all hover:shadow-blue-500/40"
                      >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          Start New Chat
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-3">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Recent History</h3>
                      {sessions.length === 0 && (
                          <div className="text-center py-10 opacity-50">
                              <p className="text-slate-400 text-sm">No previous chats</p>
                          </div>
                      )}
                      
                      {sessions.map(s => (
                          <div key={s.id} className="relative group">
                              <div 
                                  onClick={() => handleSessionSelect(s.id)}
                                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-start ${
                                      currentSessionId === s.id 
                                      ? 'bg-blue-50/80 border-blue-200 shadow-sm ring-1 ring-blue-100' 
                                      : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                                  }`}
                              >
                                  <div className="flex-1 min-w-0 pr-3">
                                      <h4 className={`font-bold text-sm truncate ${currentSessionId === s.id ? 'text-blue-700' : 'text-slate-800'}`}>
                                          {s.title || "New Consultation"}
                                      </h4>
                                      <p className="text-xs text-slate-500 mt-1.5 truncate leading-relaxed">{s.snippet || "Empty conversation"}</p>
                                  </div>
                                  
                                  <button 
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveOptionSessionId(activeOptionSessionId === s.id ? null : s.id);
                                      }}
                                      className={`p-1.5 rounded-full hover:bg-slate-200/80 text-slate-400 transition-colors ${activeOptionSessionId === s.id ? 'bg-slate-200 text-slate-600' : ''}`}
                                  >
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                  </button>
                              </div>

                              {/* Dropdown Menu */}
                              {activeOptionSessionId === s.id && (
                                  <div className="absolute right-2 top-12 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 z-10 overflow-hidden animate-fade-in origin-top-right ring-1 ring-black/5">
                                      <button 
                                          onClick={(e) => { e.stopPropagation(); setSessionToDelete(s.id); setActiveOptionSessionId(null); }}
                                          className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 font-medium flex items-center gap-2 transition-colors"
                                      >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                          Delete
                                      </button>
                                      <button 
                                          onClick={(e) => { e.stopPropagation(); setSessionToReport(s.id); setActiveOptionSessionId(null); }}
                                          className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 font-medium flex items-center gap-2 border-t border-slate-50 transition-colors"
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
          </div>
      )}

      {/* --- HEADER --- */}
      <div className="bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 border-b border-slate-100/50">
         <div className="flex items-center gap-3">
             <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             </button>
             <div>
                <h1 className="font-bold text-lg text-slate-900 tracking-tight">AI Pharmacist</h1>
                {currentSessionId && (
                   <div className="flex items-center gap-1.5">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                       <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Online</span>
                   </div>
                )}
             </div>
         </div>
         <button onClick={() => setShowChatMenu(true)} className="p-2.5 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
         </button>
      </div>

      {/* --- MESSAGES AREA --- */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32 space-y-6">
        {activeMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
                 <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-blue-600 mb-6 shadow-xl shadow-blue-100 border border-blue-50">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Hello!</h2>
                 <p className="text-slate-500 font-medium max-w-xs leading-relaxed">I'm here to help with your medications and health questions.</p>
                 
                 <div className="mt-8 grid grid-cols-1 gap-3 w-full max-w-xs">
                    {['I have a headache', 'Stomach pain relief', 'Check drug interaction'].map(s => (
                        <button key={s} onClick={() => handleSend(s)} className="text-sm bg-white border border-slate-200 px-5 py-3 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all text-slate-600 font-medium shadow-sm flex items-center justify-between group">
                            {s}
                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    ))}
                 </div>
            </div>
        )}

        {activeMessages.map((msg) => (
            <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start items-end gap-3'}`}
            >
                {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-md border-2 border-white mb-1">AI</div>
                )}
                <div className={`flex flex-col gap-1.5 max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    
                    {/* Attachments Bubble */}
                    {msg.attachments && msg.attachments.length > 0 && (
                        <div className={`flex flex-wrap gap-2 mb-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.attachments.map((att, idx) => (
                                <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
                                    {att.type === 'image' ? (
                                        <img src={`data:${att.mimeType};base64,${att.data}`} alt="attachment" className="h-40 w-auto object-cover" />
                                    ) : (
                                        <div className="h-24 w-32 flex flex-col items-center justify-center bg-rose-50 text-rose-500 p-3">
                                            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                            <span className="text-[10px] font-bold truncate w-full text-center px-1">{att.name}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Text Bubble */}
                    {msg.text && (
                        <div 
                        className={`px-5 py-3.5 whitespace-pre-wrap text-[15px] leading-relaxed shadow-sm transition-all relative group ${
                            msg.sender === 'user' 
                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-blue-200' 
                            : 'bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-slate-100 shadow-slate-100'
                        }`}
                        >
                            {msg.text}
                        </div>
                    )}
                    
                    {/* Diagnosis Card */}
                    {msg.diagnosisData && (
                        <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm mt-2 mb-1 w-full max-w-xs">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Analysis</span>
                                <span className="text-xs font-bold text-blue-600">{msg.diagnosisData.confidence}% Conf.</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-1">{msg.diagnosisData.condition}</h4>
                            <p className="text-xs text-slate-500">{msg.diagnosisData.description}</p>
                        </div>
                    )}

                    <span className="text-[10px] text-slate-400 px-1 font-medium tracking-wide">
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
            </div>
        ))}

        {isLoading && (
            <div className="flex justify-start items-end gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 animate-pulse mb-1">AI</div>
                 <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm border border-slate-100 flex gap-1.5 items-center shadow-sm">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                </div>
            </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="absolute bottom-6 left-0 right-0 px-4 z-20">
          
        {/* Floating Attachment Preview */}
        {attachments.length > 0 && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-slate-200 shadow-lg animate-slide-up flex gap-3 overflow-x-auto">
                {attachments.map((att, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl border border-slate-100 bg-slate-50 shadow-sm flex-shrink-0 group overflow-hidden">
                        {att.type === 'image' ? (
                            <img src={`data:${att.mimeType};base64,${att.data}`} className="w-full h-full object-cover" alt="preview" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-rose-500 p-1">
                                <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                <span className="text-[8px] truncate w-full text-center">{att.name}</span>
                            </div>
                        )}
                        <button 
                            onClick={() => removeAttachment(i)}
                            className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-1 backdrop-blur-sm transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        )}

        <div className="max-w-md mx-auto bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-2 flex items-end gap-2">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,application/pdf"
                onChange={handleFileSelect}
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className={`p-3 rounded-full transition-all duration-200 ${
                    attachments.length > 0 ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
                }`}
                title="Attach file"
            >
                <svg className="w-6 h-6 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            </button>
            
            <div className="flex-1 py-3">
                <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder={attachments.length > 0 ? "Add a caption..." : "Type your message..."}
                    className="w-full bg-transparent focus:outline-none resize-none max-h-32 text-slate-800 placeholder:text-slate-400 leading-relaxed"
                    rows={1}
                />
            </div>
            
            <button 
                onClick={() => handleSend()} 
                disabled={(!input.trim() && attachments.length === 0) || isLoading}
                className={`p-3 rounded-full text-white transition-all duration-300 shadow-md ${
                    (!input.trim() && attachments.length === 0) || isLoading
                    ? 'bg-slate-200 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95'
                }`}
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};