import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ChatSession, Message, SeverityLevel, ClinicalSummary } from '../types';
import { encryptData, decryptData, generateId, calculateSeverity } from '../utils/chatUtils';

// --- State Definition ---
interface ChatState {
  sessions: ChatSession[];
  messages: Record<string, Message[]>; // Map sessionId -> messages
  currentSessionId: string | null;
}

// --- Actions ---
type ChatAction =
  | { type: 'LOAD_FROM_STORAGE'; payload: ChatState }
  | { type: 'CREATE_SESSION'; payload: { id: string, timestamp: number } }
  | { type: 'SET_CURRENT_SESSION'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { sessionId: string, message: Message } }
  | { type: 'CLEAR_CURRENT_SESSION' }
  | { type: 'DELETE_SESSION'; payload: string }
  // summary action can remain but not used
  | { type: 'UPDATE_SESSION_SUMMARY'; payload: { sessionId: string, summary: ClinicalSummary } };

// --- Initial State ---
const initialState: ChatState = {
  sessions: [],
  messages: {},
  currentSessionId: null,
};

// --- Reducer ---
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'LOAD_FROM_STORAGE':
      return action.payload;

    case 'CREATE_SESSION': {
      const newSession: ChatSession = {
        id: action.payload.id,
        title: 'New Consultation',
        createdAt: action.payload.timestamp,
        lastUpdated: action.payload.timestamp,
        severity: 'blue',
        snippet: 'Empty conversation'
      };
      return {
        ...state,
        sessions: [newSession, ...state.sessions],
        currentSessionId: newSession.id,
        messages: { ...state.messages, [newSession.id]: [] }
      };
    }

    case 'SET_CURRENT_SESSION':
      return { ...state, currentSessionId: action.payload };

    case 'ADD_MESSAGE': {
      const { sessionId, message } = action.payload;
      const sessionMessages = state.messages[sessionId] || [];
      const updatedMessages = [...sessionMessages, message];
      
      // Update Session Metadata
      const sessionIndex = state.sessions.findIndex(s => s.id === sessionId);
      let updatedSessions = [...state.sessions];
      
      if (sessionIndex !== -1) {
        const currentSession = updatedSessions[sessionIndex];
        
        // Calculate new Severity
        const msgSeverity = calculateSeverity(message.text);
        let newSeverity = currentSession.severity;
        if (msgSeverity === 'red') newSeverity = 'red';
        else if (msgSeverity === 'yellow' && newSeverity !== 'red') newSeverity = 'yellow';

        // Auto-title if it's the first user message: first 4 words
        let newTitle = currentSession.title;
        if (sessionMessages.length === 0 && message.sender === 'user') {
            const words = message.text.trim().split(/\s+/).slice(0, 4);
            newTitle = words.join(' ');
            if (message.text.trim().split(/\s+/).length > 4) newTitle += '...';
        }

        updatedSessions[sessionIndex] = {
          ...currentSession,
          lastUpdated: message.createdAt,
          snippet: message.text.substring(0, 50),
          severity: newSeverity,
          title: newTitle,
          summary: undefined
        };

        // move session to top
        updatedSessions.sort((a, b) => b.lastUpdated - a.lastUpdated);
      }

      return {
        ...state,
        sessions: updatedSessions,
        messages: { ...state.messages, [sessionId]: updatedMessages }
      };
    }

    case 'DELETE_SESSION': {
        const idToDelete = action.payload;
        const newSessions = state.sessions.filter(s => s.id !== idToDelete);
        const newMessages = { ...state.messages };
        delete newMessages[idToDelete];
        
        let newCurrentId = state.currentSessionId;
        if (state.currentSessionId === idToDelete) {
            newCurrentId = null; 
        }

        return {
            ...state,
            sessions: newSessions,
            messages: newMessages,
            currentSessionId: newCurrentId
        };
    }

    case 'UPDATE_SESSION_SUMMARY': {
        const { sessionId, summary } = action.payload;
        const updatedSessions = state.sessions.map(s => 
            s.id === sessionId ? { ...s, summary } : s
        );
        return {
            ...state,
            sessions: updatedSessions
        };
    }

    default:
      return state;
  }
};

// --- Context ---
interface ChatContextType extends ChatState {
  createNewSession: () => void;
  loadSession: (id: string) => void;
  sendMessage: (text: string, sender: 'user' | 'bot', extra?: any) => void;
  clearCurrentSession: () => void;
  deleteSession: (id: string) => void;
  generateSummary: (sessionId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load from LocalStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem('ai_pharmacist_chat_data');
    if (storedData) {
      const decrypted = decryptData<ChatState>(storedData);
      if (decrypted) {
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: decrypted });
      }
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (state.sessions.length > 0) {
      const encrypted = encryptData(state);
      localStorage.setItem('ai_pharmacist_chat_data', encrypted);
    }
  }, [state]);

  const createNewSession = () => {
    dispatch({ type: 'CREATE_SESSION', payload: { id: generateId(), timestamp: Date.now() } });
  };

  const loadSession = (id: string) => {
    dispatch({ type: 'SET_CURRENT_SESSION', payload: id });
  };

  const sendMessage = (text: string, sender: 'user' | 'bot', extra?: any) => {
    if (!state.currentSessionId) return;

    const newMessage: Message = {
      id: generateId(),
      sessionId: state.currentSessionId,
      sender,
      text,
      createdAt: Date.now(),
      safetyFlags: [],
      ...extra
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { sessionId: state.currentSessionId, message: newMessage } });
  };

  const clearCurrentSession = () => {
      dispatch({ type: 'CLEAR_CURRENT_SESSION' });
  };

  const deleteSession = (id: string) => {
      dispatch({ type: 'DELETE_SESSION', payload: id });
  };

  // summary generation removed in demo
  const generateSummary = async (_: string) => {
      // no-op
      return;
  };

  return (
    <ChatContext.Provider value={{ ...state, createNewSession, loadSession, sendMessage, clearCurrentSession, deleteSession, generateSummary }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};