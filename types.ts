
export enum Screen {
  // Auth
  LOGIN = 'LOGIN',
  REGISTER_PERSONAL = 'REGISTER_PERSONAL',
  REGISTER_TERMS = 'REGISTER_TERMS',
  REGISTER_MEDICAL = 'REGISTER_MEDICAL',
  
  // Forgot Password Flow
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  FORGOT_PASSWORD_OTP = 'FORGOT_PASSWORD_OTP',
  RESET_PASSWORD = 'RESET_PASSWORD', // New Screen
  
  // Main App
  IMPORTANT_NOTICE = 'IMPORTANT_NOTICE',
  DASHBOARD = 'DASHBOARD',
  SAFETY_CHECK = 'SAFETY_CHECK',
  CHAT = 'CHAT',
  SEARCH = 'SEARCH',
  HISTORY = 'HISTORY',
  SESSION_DETAILS = 'SESSION_DETAILS', // Deep link to specific session
  PROFILE = 'PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE',
  SETTINGS = 'SETTINGS',

  // Placeholder Pages
  NOTIFICATIONS_SETTINGS = 'NOTIFICATIONS_SETTINGS', // Deprecated in UI, kept for compatibility if needed
  DATA_PRIVACY = 'DATA_PRIVACY',
  SAFETY_DISCLAIMERS = 'SAFETY_DISCLAIMERS',
  HELP_SUPPORT = 'HELP_SUPPORT',
  ABOUT_APP = 'ABOUT_APP',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  dob: string;
  gender: Gender;
  height: string;
  weight: string;
  bloodGroup: string;
  bloodPressure: string;
  allergies: string[];
  conditions: MedicalCondition[];
  emergencyContact: {
    name: string;
    phone: string;
  };
  shareLocation?: boolean;
}

export interface MedicalCondition {
  name: string;
  since: string;
  medication: string;
  status: 'Ongoing' | 'Recovered';
}

// --- MANDATORY CHAT MODELS ---

export type SeverityLevel = "blue" | "yellow" | "red";

export interface ClinicalSummary {
  chiefComplaints: string[];
  possibleDiagnosis: string[];
  suggestedTests: string[];
  advice: string[];
  prescription: string[];
}

export interface Attachment {
  mimeType: string;
  data: string; // Base64 string
  name: string;
  type: 'image' | 'pdf';
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  lastUpdated: number;
  severity: SeverityLevel;
  snippet: string;
  summary?: ClinicalSummary;
}

// New Interface for the Orchestrator Response Schema
export interface OrchestratorResponse {
  optimized_prompt: string;
  follow_up: {
    needed: boolean;
    question: string;
  };
  functions: Array<{
    name: string;
    priority: number;
    args: Record<string, any>;
  }>;
  user_reply: string;
  metadata: {
    red_flag: boolean;
    confidence_overall: number;
    diagnosis_suggestions: Array<{
      name: string;
      confidence: number;
      type: "likely" | "possible" | "rule-out";
    }>;
    escalation_reason: string;
  };
}

export interface Message {
  id: string;
  sessionId: string;
  sender: "user" | "bot";
  text: string;
  createdAt: number;
  safetyFlags: string[];
  attachments?: Attachment[];
  // Optional UI specific fields
  isDiagnosis?: boolean;
  diagnosisData?: {
    condition: string;
    confidence: number;
    description: string;
    medication: string;
    dosage: string;
  };
}

// -----------------------------

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  description: string;
  uses: string;
  dosage: {
    adults: string;
    children: string;
    maximum: string;
  };
  sideEffects: string[];
  manufacturer: string;
  source: string;
  medexId?: string; 
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}

export interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}
