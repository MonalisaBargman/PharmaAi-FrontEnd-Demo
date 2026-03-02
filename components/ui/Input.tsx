import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  options?: string[]; // For select inputs
}

export const Input: React.FC<InputProps> = ({ label, error, rightIcon, className = '', options, type, ...props }) => {
  const baseClassName = `w-full px-4 py-3.5 rounded-xl border bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${error ? 'border-red-500' : 'border-slate-200'} ${className}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        {type === 'select' && options ? (
          <select className={`${baseClassName} appearance-none`} {...props as any}>
            <option value="" disabled>Select {label}</option>
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
              type={type}
              className={baseClassName}
              {...props}
          />
        )}
        
        {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {rightIcon}
            </div>
        )}
        
        {/* Chevron for Select */}
        {type === 'select' && (
           <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
           </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500 ml-1 font-medium">{error}</span>}
    </div>
  );
};