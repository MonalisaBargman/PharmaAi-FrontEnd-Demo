import { SeverityLevel } from "../types";

// --- ID Generator ---
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// --- Severity Logic ---
export const calculateSeverity = (text: string): SeverityLevel => {
  const lower = text.toLowerCase();
  
  const redFlags = ['chest pain', 'breathing', 'bleeding', 'suicide', 'kill myself', 'heart attack', 'stroke', 'emergency', 'unconscious', 'collapse'];
  const yellowFlags = ['dosage', 'dose', 'diagnosis', 'symptom', 'pill', 'tablet', 'side effect', 'reaction', 'pain', 'fever'];

  if (redFlags.some(flag => lower.includes(flag))) return 'red';
  if (yellowFlags.some(flag => lower.includes(flag))) return 'yellow';
  return 'blue';
};

// --- Mock Encryption (AES simulation) ---
// In a real app, use crypto-subtle or a library like crypto-js
const SALT = "AI_PHARMACIST_SECURE_SALT_";

export const encryptData = (data: any): string => {
  try {
    const json = JSON.stringify(data);
    // Simple Base64 obscuration for demo purposes (Constraint: Encrypt stored data)
    return btoa(SALT + encodeURIComponent(json));
  } catch (e) {
    console.error("Encryption failed", e);
    return "";
  }
};

export const decryptData = <T>(cipher: string | null): T | null => {
  if (!cipher) return null;
  try {
    const decoded = decodeURIComponent(atob(cipher).replace(SALT, ''));
    return JSON.parse(decoded) as T;
  } catch (e) {
    console.error("Decryption failed", e);
    return null;
  }
};