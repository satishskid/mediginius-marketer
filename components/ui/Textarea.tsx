
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, error, className, containerClassName, ...props }) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={4}
        className={`w-full px-4 py-2.5 bg-slate-700 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-sky-500'} text-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-slate-400 transition-colors ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};
