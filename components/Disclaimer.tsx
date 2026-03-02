import React, { useState } from 'react';
import { Button } from './ui/Button';
import { SAFETY_DISCLAIMER_TEXT } from '../constants';

interface DisclaimerProps {
  onAccept: () => void;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ onAccept }) => {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setScrolled(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 border-b bg-red-50">
          <h2 className="text-xl font-bold text-red-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Important Disclaimer
          </h2>
        </div>
        
        <div 
          className="flex-1 overflow-y-auto p-6 text-slate-700 text-sm leading-relaxed whitespace-pre-line"
          onScroll={handleScroll}
        >
          {SAFETY_DISCLAIMER_TEXT}
        </div>

        <div className="p-6 border-t bg-slate-50 flex flex-col gap-3">
          <p className="text-xs text-slate-500 text-center">
            Please read the entire disclaimer to continue.
          </p>
          <Button 
            fullWidth 
            onClick={onAccept} 
            disabled={!scrolled}
            variant={scrolled ? 'primary' : 'secondary'}
          >
            {scrolled ? "I Agree & Continue" : "Scroll to Read"}
          </Button>
        </div>
      </div>
    </div>
  );
};