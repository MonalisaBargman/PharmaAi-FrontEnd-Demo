import React from 'react';
import { Button } from './ui/Button';

interface ImportantNoticeProps {
  onConfirm: () => void;
}

export const ImportantNotice: React.FC<ImportantNoticeProps> = ({ onConfirm }) => {
  return (
    <div className="flex flex-col h-full bg-white p-6 justify-center text-center">
      <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Important Notice</h2>
      
      <div className="bg-blue-50 p-6 rounded-2xl mb-8">
        <p className="text-slate-700 text-sm leading-relaxed">
          AI Pharmacist provides health guidance but is not a substitute for professional medical advice. Follow instructions and seek medical care if symptoms are severe.
        </p>
      </div>
      
      <Button fullWidth onClick={onConfirm}>
        I understand & Agree
      </Button>
    </div>
  );
};