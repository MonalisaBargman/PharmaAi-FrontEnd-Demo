import React, { useState } from 'react';
import { Button } from './ui/Button';

interface SafetyCheckProps {
  onPass: () => void;
  onCancel: () => void;
}

export const SafetyCheck: React.FC<SafetyCheckProps> = ({ onPass, onCancel }) => {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const questions = [
    "Do you have difficulty breathing right now?",
    "Are you experiencing severe chest pain?",
    "Do you have uncontrolled bleeding?",
    "Are you feeling confused or disoriented?"
  ];

  const handleAnswer = (index: number, val: boolean) => {
    setAnswers(prev => ({ ...prev, [index]: val }));
  };

  const hasAnyYes = Object.values(answers).some(val => val === true);
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  if (hasAnyYes) {
      return (
        <div className="flex flex-col h-full bg-white p-6 justify-center text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">This may be serious</h2>
            <p className="text-slate-600 mb-8">Based on your response, you may need immediate medical attention.</p>
            
            <div className="space-y-3">
                <Button variant="danger" fullWidth onClick={() => window.open('tel:911')}>Call Emergency</Button>
                <Button variant="secondary" fullWidth onClick={() => window.open('https://www.google.com/maps/search/hospitals')}>Find nearby hospital</Button>
            </div>
            <button onClick={() => setAnswers({})} className="mt-8 text-slate-400 text-sm">Mistake? Reset answers</button>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
        <div className="p-4 bg-white border-b flex items-center">
            <button onClick={onCancel}><svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
            <h1 className="ml-4 text-lg font-bold text-slate-900">Quick safety check</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
            <p className="text-slate-600 text-sm mb-6 bg-slate-100 p-4 rounded-xl">Please answer these questions to ensure your safety</p>
            
            <div className="space-y-6">
                {questions.map((q, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <p className="font-medium text-slate-800 mb-4">{q}</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => handleAnswer(i, false)}
                                className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${answers[i] === false ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'}`}
                            >
                                No
                            </button>
                            <button 
                                onClick={() => handleAnswer(i, true)}
                                className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${answers[i] === true ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-slate-700 border-slate-200'}`}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="p-4 bg-white border-t">
            <Button fullWidth disabled={!allAnswered} onClick={onPass}>Continue to Chat</Button>
        </div>
    </div>
  );
};